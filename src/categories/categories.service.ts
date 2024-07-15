import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CategoriesService {
    constructor(private readonly prismaService: PrismaService,
                private readonly usersService: UsersService
    ) {}

    private async watchVerify(User: any, categoryName: string, type: string) {
        if (!User.isTelegramVerify) return false;

        const category = await this.findBy({ name: categoryName })

        if (!category) return false; 

        if ((type === "add" && User.watchingCategories.includes(categoryName)) || (type === "delete" && !User.watchingCategories.includes(categoryName))) return false;

        return true
    }

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

    async findBy(find: Object) {
        return await this.prismaService.category.findFirst({ where: find })
    }

    async addToWatching(categoryName: string, userId: number) {
        const User = await this.usersService.findBy({ id: userId })

        if (!await this.watchVerify(User, categoryName, "add")) return false;

        return await this.usersService.update({
            watchingCategories: [categoryName, ...User.watchingCategories]
        }, User.id)
    }

    async removeFromWatch(categoryName: string, userId: number) {
        const User = await this.usersService.findBy({ id: userId })

        if (!await this.watchVerify(User, categoryName, "delete")) return false; 

        User.watchingCategories.splice(User.watchingCategories.indexOf(categoryName))

        return await this.usersService.update({
            watchingCategories: User.watchingCategories
        }, User.id)
    }
}
