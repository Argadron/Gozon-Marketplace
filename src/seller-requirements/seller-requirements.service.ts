import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSellerRequirementDto } from './dto/create-seller-requirement.dto';
import { JwtUser } from '../auth/interfaces';
import { RoleEnum } from '@prisma/client';
import { GetAllRequirementsDto } from './dto/get-all-requirements-query.dto';

@Injectable()
export class SellerRequirementsService {
    constructor(private readonly prismaService: PrismaService) {}

    async createSellerRequirement(dto: CreateSellerRequirementDto, user: JwtUser) {
        const User = await this.prismaService.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (User.role === RoleEnum.SELLER) throw new ForbiddenException("Already has seller role")

        if (await this.prismaService.sellerRequirement.findUnique({
            where: {
                userId: User.id
            }
        })) throw new ConflictException("You already has seller requirement")

        return await this.prismaService.sellerRequirement.create({
            data: {
                userId: user.id,
                ...dto
            }
        })
    }

    async getAll(query: GetAllRequirementsDto) {
        const result = await this.prismaService.sellerRequirement.findMany({
            skip: (query.page - 1)*query.requirementsOnPage,
            take: query.requirementsOnPage
        })

        const pages = Math.floor(await this.prismaService.sellerRequirement.count()/50)

        return { result, pages: pages === 0 ? 1 : pages }
    }
}
