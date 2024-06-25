import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddProductDto } from './dto/add-product.dto';
import { JwtUser } from '../auth/interfaces';

@Injectable()
export class BasketService {
    constructor(private readonly prismaService: PrismaService) {}

    async addProduct(dto: AddProductDto, user: JwtUser) {
        const product = await this.prismaService.product.findUnique({
            where: {
                id: dto.productId
            }
        })

        if (!product) throw new NotFoundException("Product not found")

        if (product.count < dto.productCount) throw new BadRequestException("Product count less than dto count")

        if (await this.prismaService.userProducts.findFirst({ where: { productId: product.id, userId: user.id } })) throw new ConflictException("Product already exsists on your basket")

        return await this.prismaService.userProducts.create({
            data: {
                userId: user.id,
                ...dto
            }
        })
    }
}
