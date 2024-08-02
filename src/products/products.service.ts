import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { AllProductsDto } from './dto/all-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { FileService } from '../file.service';
import { Filters, UpdateData } from './interfaces';
import { CategoriesService } from '../categories/categories.service';
import { TelegramService } from '../telegram/telegram.service';
import { UsersService } from '../users/users.service';
import { JwtUser } from '../auth/interfaces';
import { Response } from 'express';

@Injectable()
export class ProductsService {
    constructor(private readonly prismaService: PrismaService,
                private readonly fileService: FileService,
                private readonly categoriesService: CategoriesService,
                private readonly telegramService: TelegramService,
                private readonly usersService: UsersService,
                private readonly configService: ConfigService
    ) {}

    private filterCreator(filters: Filters) {
        const result: Prisma.ProductWhereInput[] = []

        if (filters.priceMin) result.push({ price: { gte: filters.priceMin } })

        if (filters.priceMax) result.push({ price: { lte: filters.priceMax } })

        if (filters.tags?.length > 0) result.push({ tags: { hasSome: filters.tags } })

        if (filters.categories?.length > 0) result.push({ categories: {
            hasEvery: filters.categories
        } })

        return result
    }

    private async photoDownloader(file: Express.Multer.File=undefined) {
        let productPhoto = "";

        if (file) {
            if (!this.fileService.validateFileType(file.originalname)) throw new BadRequestException("Product photo has invalid type")
        }

        file ? productPhoto = await this.fileService.downolad(file) : null 

        return productPhoto ? productPhoto : undefined
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

    /**
     * This method calculate product(s) pages with filter
     * @param filter - A object with filters. Example: { name: "product" }
     * @returns number
     */
    private async calcProductPages(filter: Object) {
        return Math.floor(await this.prismaService.product.count({ where: filter })/50)
    }

    async getAll(query: AllProductsDto) {
        const filters: Filters = query["filter"]
        const sortedFilters = filters ? this.filterCreator(filters) : []

        const result = await this.prismaService.product.findMany({
            skip: (query.page - 1)*query.productOnPage,
            take: query.productOnPage,
            where: {
                AND: sortedFilters 
            },
            include: {
                reviews: true,
                reports: true
            },
            orderBy: {
                price: filters?.UpOrDown ? "asc" : "desc"
            }
        })
        
        const pages = await this.calcProductPages({ AND: sortedFilters })

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

    async searchProduct(query: SearchProductDto) {
        const returnObject = await this.prismaService.product.findMany({
            skip: (query.page - 1)*query.productOnPage,
            take: query.productOnPage,
            where: {
                name: {
                    contains: query.name
                }
            },
            include: {
                reports: true,
                reviews: true
            }
        })

        if (returnObject.length === 0) throw new NotFoundException("Product(s) not found")

        const pages = await this.calcProductPages({ name: { contains: query.name } })

        return { result: returnObject, pages: pages === 0 ? 1 : pages }
    }

    async getWithReports() {
        return await this.prismaService.product.findMany({
            where: {
                reportsCount: {
                    gte: 1
                }
            },
            include: {
                reports: true
            }
        })
    }

    async create(dto: CreateProductDto, user: JwtUser, file: Express.Multer.File=undefined) {
        if (dto.categories?.length > 0) {
            const categories = await this.categoriesService.getAll()

            for (let i in dto.categories) {
                if (!categories.find(elem => elem.name === dto.categories[i])) throw new BadRequestException("Product category(es) not valid")
            }
        }

        const productPhoto = await this.photoDownloader(file)

        delete dto.productPhoto

        const product = await this.prismaService.product.create({
            data: {
                ...dto, 
                productPhoto: productPhoto ? productPhoto : "default.png",
                sellerId: user.id,
            }
        })

        const usersNeedToSengTelegramAlert = await this.usersService.findByMany({
            watchingCategories: {
                hasSome: this.configService.get("NODE_ENV") === "test" ? ["..."] : dto.categories
            },
            isTelegramVerify: true
        })

        if (usersNeedToSengTelegramAlert.length !== 0) {
            for (let i in usersNeedToSengTelegramAlert) {
                const currentUser = usersNeedToSengTelegramAlert[i]
    
                const telegramUser = await this.telegramService.findTelegramIdByUserId(currentUser.id)
    
                if (!telegramUser) continue 

                const url = `${this.configService.get("API_CLIENT_URL")}/product?id=${product.id}`
    
                await this.telegramService.sendMessage(telegramUser.telegramId, `Появился новый отслеживаемый товар: ${dto.name}! \n Просмотрите по ссылке: ${url}`)
            }
        }

        return product
    }

    async update(dto: Partial<UpdateProductDto>, user: JwtUser, file: Express.Multer.File=undefined) {
        const product = await this.validateProduct(dto.id, user)

        const productPhoto = await this.photoDownloader(file)

        delete dto.productPhoto

        return await this.prismaService.product.update({  
            where: {
                id: dto.id
            },
            data: {
                productPhoto: productPhoto ? productPhoto : product.productPhoto,
                ...dto
            }
        })
    }

    async delete(id: number, user: JwtUser) {
        const product = await this.validateProduct(id, user)

        await this.fileService.delete(product.productPhoto)

        return await this.prismaService.product.delete({
            where: {
                id
            }
        })
    }

    /**
     * This method need to internal update product from code. No use on controller. (Method not check the product exsists)
     * @param id - Product id
     * @param updateData - Data to update product
     * @return - Updated product
     */
    async updateInertnal(id: number, updateData: UpdateData) {
        return await this.prismaService.product.update({
            where: {
                id
            },
            data: updateData
        })
    }
}
