import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AllProductsDto } from './dto/all-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtUser } from '../auth/interfaces';
import { FileService } from '../file.service';
import { Filters } from './interfaces';
import { Prisma } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';

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

    private photoDownloader(file: Express.Multer.File=undefined) {
        let productPhoto = "";

        if (file) {
            if (!this.fileService.validateFileType(file.originalname)) throw new BadRequestException("Product photo has invalid type")
        }

        file ? productPhoto = this.fileService.downolad(file) : null 

        return productPhoto ? productPhoto : undefined
    }

    private updateRequestFilter(dto: UpdateProductDto, productPhoto: string=undefined) {
        const result: Prisma.ProductUpdateInput = {}

        const { count, price, name, description, tags } = dto

        if (!count && !price && !name && !description && !tags?.length) throw new BadRequestException("1 of 5 plants must be writed")

        count ? result.count = count: null 
        price ? result.price = price : null 
        name ? result.name = name : null 
        description ? result.description = description : null 
        tags?.length ? result.tags = tags : null 
        productPhoto ? result.productPhoto = productPhoto : null

        return result
    }

    /**
     * This method validate product: his is exsists and seller id equal user id and returns product
     * @param id - Product id
     * @param user - User 
     * @returns product
     */
    private async validateProduct(id: number, user: JwtUser) {
        const product = await this.prismaService.product.findUnique({
            where: {
                id
            }
        })

        if (!product) throw new NotFoundException("Product not found")

        if (product.sellerId !== user.id) throw new ForbiddenException("This is not your product.")

        return product
    }

    async getAll(query: AllProductsDto) {
        const filters: Filters = query.filter
        const result = await this.prismaService.product.findMany({
            skip: (query.page - 1)*query.productOnPage,
            take: query.productOnPage,
            where: {
                AND: filters ? this.filterCreator(filters) : []
            },
            include: {
                reviews: true,
                reports: true
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
            },
            include: {
                reports: true, 
                reviews: true
            }
        })

        if (!product) throw new NotFoundException("Product not found")

        return product
    }

    async getPhotoById(id: number, res: Response) {
        const product = await this.prismaService.product.findUnique({
            where: {
                id
            }
        })

        if (!product) throw new NotFoundException("Product not found")

        return this.fileService.get(res, product.productPhoto)
    }

    async create(dto: CreateProductDto, user: JwtUser, file: Express.Multer.File=undefined) {
        const productPhoto = this.photoDownloader(file)

        delete dto.productPhoto

        return await this.prismaService.product.create({
            data: {
                ...dto, 
                productPhoto: productPhoto ? productPhoto : "default.png",
                sellerId: user.id
            }
        })
    }

    async update(dto: UpdateProductDto, user: JwtUser, file: Express.Multer.File=undefined) {
        await this.validateProduct(dto.id, user)

        const productPhoto = this.photoDownloader(file)

        delete dto.productPhoto

        const data = this.updateRequestFilter(dto, productPhoto)

        return await this.prismaService.product.update({  
            where: {
                id: dto.id
            },
            data
        })
    }

    async delete(id: number, user: JwtUser) {
        const product = await this.validateProduct(id, user)

        this.fileService.delete(product.productPhoto)

        return await this.prismaService.product.delete({
            where: {
                id
            }
        })
    }
}
