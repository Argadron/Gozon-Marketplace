import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSellerRequirementDto } from './dto/create-seller-requirement.dto';
import { JwtUser } from '../auth/interfaces';
import { RoleEnum } from '@prisma/client';
import { GetAllRequirementsDto } from './dto/get-all-requirements-query.dto';
import { CloseSellerRequirementDto } from './dto/close-seller-requirement.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class SellerRequirementsService {
    constructor(private readonly prismaService: PrismaService,
                private readonly userService: UsersService
    ) {}

    async createSellerRequirement(dto: CreateSellerRequirementDto, user: JwtUser) {
        const User = await this.userService.getProfile(user.id)

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

    async close(dto: CloseSellerRequirementDto) {
        const User = await this.userService.getProfile(dto.userId)

        if (!User) throw new NotFoundException("User not found")

        if (User.role === RoleEnum.SELLER) throw new ConflictException("User already has role")

        if (!await this.prismaService.sellerRequirement.findUnique({ where: { userId: User.id } })) throw new BadRequestException("User not has a valid seller requirement")

        if (dto.accepted) {
            await this.userService.setUserRole(RoleEnum.SELLER, User.id)
        }
        
        return await this.prismaService.sellerRequirement.delete({
            where: {
                userId: User.id
            }
        })
    }
}
