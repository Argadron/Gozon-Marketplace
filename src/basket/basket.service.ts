import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddProductDto } from './dto/add-product.dto';
import { JwtUser } from '../auth/interfaces';
import { ProductsService } from '../products/products.service';

@Injectable()
export class BasketService {
    constructor(private readonly prismaService: PrismaService,
                private readonly productService: ProductsService
    ) {}

    async addProduct(dto: AddProductDto, user: JwtUser) {
        const product = await this.productService.getById(dto.productId)

        if (product.count < dto.productCount) throw new BadRequestException("Product count less than dto count")

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
}
