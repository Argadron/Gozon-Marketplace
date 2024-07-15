import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAll() {
        return await this.prismaService.category.findMany({
            select: {
                name: true,
                id: true
            }
        })
    }

    async create(dto: CreateCategoryDto) {
        if (await this.prismaService.category.findUnique({ where: { name: dto.name } })) throw new ConflictException("Category with this name already exsists")

        return await this.prismaService.category.create({
            data: dto
        })
    }

    async delete(id: number) {
        if (!await this.prismaService.category.findUnique({ where: { id } })) throw new NotFoundException("Category not found")

        return await this.prismaService.category.delete({
            where: {
                id
            }
        })
    }
}
