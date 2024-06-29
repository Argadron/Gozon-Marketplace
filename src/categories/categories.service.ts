import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

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
}
