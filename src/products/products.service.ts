import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AllProductsDto } from './dto/all-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtUser } from '../auth/interfaces';
import { FileService } from '../file.service';
import { Filters } from './interfaces';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private readonly prismaService: PrismaService,
                private readonly fileService: FileService
    ) {}

    private filterCreator(filters: Filters) {
        const result: Prisma.ProductWhereInput[] = []

        if (filters.priceMin) result.push({ price: { gte: filters.priceMin } })

        if (filters.priceMax) result.push({ price: { lte: filters.priceMax } })

        if (filters.tags?.length > 0) result.push({ tags: { hasSome: filters.tags } })

        if (filters.categories?.length > 0) result.push({ categories: {
            some: {
                categories: {
                    name: {
                        in: filters.categories
                    }
                }
            }
        } })

        return result
    }

    async getAll(query: AllProductsDto) {
        const filters: Filters = query.filter
        const result = await this.prismaService.product.findMany({
            skip: (query.page - 1)*query.productOnPage,
            take: query.productOnPage,
            where: {
                AND: filters ? this.filterCreator(filters) : []
            },
            orderBy: {
                price: filters?.UpOrDown ? "asc" : "desc"
            }
        })
        
        const pages = Math.floor(await this.prismaService.product.count()/50)

        return { result, pages: pages === 0 ? 1:pages }
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

    async create(dto: CreateProductDto, user: JwtUser, file: Express.Multer.File=undefined) {
        let productPhoto = "";

        if (file) {
            if (!this.fileService.validateFileType(file.originalname)) throw new BadRequestException("Product photo has invalid type")
        }

        file ? productPhoto = this.fileService.downolad(file) : null 

        delete dto.productPhoto

        return await this.prismaService.product.create({
            data: {
                ...dto, 
                productPhoto: productPhoto ? productPhoto : "default.png",
                sellerId: user.id
            }
        })
    }
}
