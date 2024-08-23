import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AddProductDto } from './dto/add-product.dto';
import { UpdateProductCountDto } from './dto/update-product-count.dto';
import { ValidateOrderDto } from './dto/validate-order.dto';
import { PrismaService } from '../prisma.service';
import { JwtUser } from '../auth/interfaces';
import { ProductsService } from '../products/products.service';
import { AuthService } from '../auth/auth.service';
import { STRIPE_CLIENT } from '../stripe/constants';
import { PaymentsService } from '../payments/payments.service';
import { AlertsService } from '../alerts/alerts.service';
import Stripe from 'stripe';
import { v4 } from 'uuid'
import { Request } from 'express';

@Injectable()
export class BasketService {
    constructor(private readonly prismaService: PrismaService,
                private readonly productService: ProductsService,
                @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
                @Inject(ConfigService) private readonly configService: ConfigService,
                private readonly paymentsService: PaymentsService,
                private readonly alertsService: AlertsService,
                private readonly authService: AuthService
    ) {}

    /**
     * This method find product on user basket and check two parameters:
     * 1: product exsists
     * 2: product userId === userId
     * @param productId 
     * @param userId 
     * @returns product
     */
    private async getProductOnBasketByIdOrThrow(productId: number, userId: number) {
        const product = await this.prismaService.userProducts.findFirst({
            where: {
                userId,
                productId
            }
        })

        if (!product) throw new NotFoundException("Product not found on basket")

        if (product.userId !== userId) throw new ForbiddenException("This is not your product")

        return product
    }

    private async getUserBasket(userId: number) {
        return await this.prismaService.userProducts.findMany({
            where: {
                userId: userId
            },
            include: {
                product: true
            }
        })
    }

    private async getSharedBaksetOrThrow(url: string) {
        const sharedBasket = await this.prismaService.sharedBasket.findUnique({
            where: {
                url
            }
        })

        if (!sharedBasket) throw new NotFoundException("Basket not found")

        return sharedBasket
    }

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
        await this.getProductOnBasketByIdOrThrow(id, user.id)

        return await this.prismaService.userProducts.deleteMany({
            where: {
                productId: id,
                userId: user.id
            }
        })
    }

    async updateProductCount(id: number, dto: UpdateProductCountDto, user: JwtUser) {
        await this.getProductOnBasketByIdOrThrow(id, user.id)

        const product = await this.productService.getById(id)

        if (product.count < dto.count) throw new BadRequestException("New count gt product count")

        return await this.prismaService.userProducts.updateMany({
            where: {
                productId: id,
                userId: user.id
            },
            data: {
                productCount: dto.count
            }
        })
    }

    async createOrder(user: JwtUser) {
        const basket = await this.getUserBasket(user.id)

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

                const { price, isSold } = await this.productService.getById(productInfo.productId)

                if (isSold) continue

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

            if (normalizedProductsInfo.length === 0) throw new BadRequestException("All products is solded")

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
                const { count, sellerId, name } = await this.productService.getById(currentInfo.productId)

                const updated = await this.productService.updateInertnal(currentInfo.productId, { count: count - currentInfo.productCount })

                if (updated.count <= 0) await this.productService.updateInertnal(currentInfo.productId, { isSold: true })

                await this.alertsService.sendInternal(sellerId, `Продан продукт ${name}! Их осталось в наличии: ${updated.count}`)
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

    async copyBasket(user: JwtUser) {
        const basket = await this.getUserBasket(user.id)

        if (basket.length === 0) throw new BadRequestException("Basket is empty")

        const url = v4()
        const productsInfo = []

        basket.forEach(elem => {
            productsInfo.push({
                productId: elem.productId,
                productName: elem.product.name,
                productCount: elem.productCount
            })
        })

        await this.prismaService.sharedBasket.create({
            data: {
                userId: user.id, 
                url,
                productsInfo
            }
        })

        return `${this.configService.get("API_CLIENT_URL")}/sharedBaket/${url}`
    }

    async getCopiedBasket(url: string, req: Request) {
        const sharedBasket = await this.getSharedBaksetOrThrow(url)

        const token = req.headers.authorization
        let user: any;

        if (token) {
            user = await this.authService.verifyJwtExternal(token.split(" ")[1])
        }

        return {
            basket: sharedBasket,
            admin: user?.id === sharedBasket.userId ? true : false
        }
    }

    async deleteCopy(user: JwtUser, url: string) {
        const sharedBasket = await this.getSharedBaksetOrThrow(url)

        if (sharedBasket.userId !== user.id) throw new ForbiddenException("This is not your shared basket")

        await this.prismaService.sharedBasket.delete({
            where: {
                url
            }
        })

        return undefined
    }

    async replaceBasket(user: JwtUser, url: string) {
        const sharedBasket = await this.getSharedBaksetOrThrow(url)

        const newBasket = sharedBasket.productsInfo.map((elem) => {
            const basketElem = JSON.parse(JSON.stringify(elem as any))

            return {
                productId: basketElem.productId, 
                productCount: basketElem.productCount,
                userId: user.id
            }
        })
        
        await this.prismaService.userProducts.deleteMany({
            where: {
                userId: user.id
            }
        })

        await this.prismaService.userProducts.createMany({
            data: newBasket
        })

        return undefined
    }
}
