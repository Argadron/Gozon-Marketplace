import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddProductDto } from './dto/add-product.dto';
import { JwtUser } from '../auth/interfaces';
import { ProductsService } from '../products/products.service';
import { STRIPE_CLIENT } from '../stripe/constants';
import Stripe from 'stripe';
import { v4 } from 'uuid'
import { ConfigService } from '@nestjs/config';
import { ValidateOrderDto } from './dto/validate-order.dto';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class BasketService {
    constructor(private readonly prismaService: PrismaService,
                private readonly productService: ProductsService,
                @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
                @Inject(ConfigService) private readonly configService: ConfigService,
                private readonly paymentsService: PaymentsService
    ) {}

    async addProduct(dto: AddProductDto, user: JwtUser) {
        const product = await this.productService.getById(dto.productId)

        if (product.count < dto.productCount) throw new BadRequestException("Product count less than dto count")

        if (product.isSold) throw new BadRequestException("Product is solded")

        if (await this.prismaService.userProducts.findFirst({ where: { productId: product.id, userId: user.id } })) throw new ConflictException("Product already exsists on your basket")

        return await this.prismaService.userProducts.create({
            data: {
                userId: user.id,
                ...dto
            }
        })
    }

    async deleteProduct(id: number, user: JwtUser) {
        const product = await this.prismaService.userProducts.findFirst({
            where: {
                userId: user.id,
                productId: id
            }
        })

        if (!product) throw new NotFoundException("Product not found on basket")

        if (product.userId !== user.id) throw new ForbiddenException("This is not your product")

        return await this.prismaService.userProducts.deleteMany({
            where: {
                productId: id,
                userId: user.id
            }
        })
    }

    async createOrder(user: JwtUser) {
        const basket = await this.prismaService.userProducts.findMany({
            where: {
                userId: user.id
            },
            include: {
                product: true
            }
        })

        if (!basket || basket?.length === 0) throw new BadRequestException("User not has products on basket!")

        const checkOrder = await this.prismaService.orders.findUnique({
            where: {
                userId: user.id
            }
        })

        if (checkOrder) throw new ConflictException(`User already has order with tag: ${checkOrder.urlTag}`)

        const order = [];
        const sellerInfo = [];
        const baseUrl = `${this.configService.get("API_CLIENT_URL")}`
        const urlTag = v4()

        basket.forEach(elem => {
            const basketElem = {
                price_data: {
                    unit_amount: parseInt(elem.product.price + "00"),
                    currency: "usd",
                    product_data: {
                        name: elem.product.name,
                        description: elem.product.description
                    }
                },
                quantity: elem.productCount
            }
            const sellerElem = JSON.stringify({
                productId: elem.productId,
                sellerId: elem.product.sellerId,
                quantity: elem.productCount
            })

            order.push(basketElem)
            sellerInfo.push(sellerElem)
        })
        
        const { id, url } = await this.stripe.checkout.sessions.create({ 
            line_items: order, 
            mode: "payment",
            success_url: `${baseUrl}/order-success?urlTag=${urlTag}`,
            cancel_url: `${baseUrl}/order-cancel?urlTag=${urlTag}`,
            currency: "usd"
        })

        await this.prismaService.orders.create({
            data: {
                urlTag,
                productsInfo: sellerInfo,
                userId: user.id
            }
        })

        return {
            sessionId: id,
            url
        }
    }

    async validateOrder(dto: ValidateOrderDto, user: JwtUser) {
        const Order = await this.prismaService.orders.findFirst({ where: { urlTag: dto.urlTag } })

        if (!Order) throw new NotFoundException("Order not found")

        if (Order.userId !== user.id) throw new ForbiddenException("This is not your order")

        const list = await this.stripe.checkout.sessions.list()

        let check = false;

        list.data.forEach(elem => elem.id === dto.sessionId ? check = true : null)

        if (!check) throw new NotFoundException("Session not found")

        const session = await this.stripe.checkout.sessions.retrieve(dto.sessionId)

        if (session.payment_status === "paid") {
            const normalizedProductsInfo = [];
            const productInfoExtra = [];
            
            for (let elem of Order.productsInfo) {
                const productInfo = JSON.parse(elem as string)

                const { price } = await this.productService.getById(productInfo.productId)

                const check = normalizedProductsInfo.find(elem => elem.productId === productInfo.productId)

                if (!check) {
                    normalizedProductsInfo.push({ productId: productInfo.productId, sellerId: productInfo.sellerId, price: price * productInfo.quantity })
                } 
                else {
                    const index = normalizedProductsInfo.indexOf(check)

                    normalizedProductsInfo[index].price = normalizedProductsInfo[index].price + price * productInfo.quantity
                }

                productInfoExtra.push({ productId: productInfo.productId, productCount: productInfo.quantity })
            }

            let paymentObject = {};

            normalizedProductsInfo.forEach(elem => {
                if (!paymentObject[elem.sellerId]) {
                    paymentObject[elem.sellerId] = elem.price
                }
                else {
                    paymentObject[elem.sellerId] += elem.price
                }
            })

            paymentObject = Object.keys(paymentObject).map(elem => ({
                sellerId: parseInt(elem),
                amount: paymentObject[elem]
            }))

            for (let i in paymentObject) {
                await this.paymentsService.create({
                    payUserId: paymentObject[i].sellerId,
                    amount: paymentObject[i].amount
                })
            }

            for (let e in productInfoExtra) {
                const currentInfo = productInfoExtra[e]
                const { count } = await this.productService.getById(currentInfo.productId)

                const updated = await this.productService.updateInertnal(currentInfo.productId, { count: count - currentInfo.productCount })

                if (updated.count <= 0) await this.productService.updateInertnal(currentInfo.productId, { isSold: true })
            }

            await this.prismaService.orders.delete({
                where: {
                    userId: user.id
                }
            })

            this.configService.get("NODE_ENV") === "test" ? null : await this.prismaService.userProducts.deleteMany({
                where: {
                    OR: productInfoExtra
                }
            })

            return "Created payments success"
        }
        else {
            return "Not paid"
        }
    }
}
