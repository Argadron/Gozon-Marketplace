import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSellerRequirementDto } from './dto/create-seller-requirement.dto';
import { JwtUser } from '../auth/interfaces';
import { RoleEnum } from '@prisma/client';

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
        })) throw new BadRequestException("You already has seller requirement")

        return await this.prismaService.sellerRequirement.create({
            data: {
                userId: user.id,
                ...dto
            }
        })
    }
}
