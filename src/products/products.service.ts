import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AllProductsDto } from './dto/all-products.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAll(query: AllProductsDto) {
        return await this.prismaService.product.findMany({
            skip: query.page * 50,
            take: query.count
        })
    }

    async getById(id: number) {
        const product = await this.prismaService.product.findUnique({
            where: {
                id
            }
        })

        if (!product) throw new NotFoundException("Product not found")

        return product
    }
}
