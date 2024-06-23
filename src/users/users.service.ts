import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtUser } from '../auth/interfaces';
import { FileService } from '../file.service';
import { Response } from 'express';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService,
                private readonly fileService: FileService
    ) {}

    async getProfile(user: JwtUser) {
        const User = await this.prismaService.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                userProducts: true,
                reviews: true
            }
        })

        if (!User) throw new NotFoundException("User not found")

        delete User.updatedAt
        delete User.createdAt
        delete User.password

        return User
    }

    async getProfilePhoto(user: JwtUser, res: Response) {
        const { profilePhoto } = await this.getProfile(user)

        const file = this.fileService.get(res, profilePhoto)

        return file
    }

    async setUserBanStatus(dto: UpdateUserStatusDto, user: JwtUser): Promise<string> {
        const User = await this.prismaService.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (User.username === dto.username) throw new BadRequestException("You cannot set ban status yourself")

        if (!await this.prismaService.user.findUnique({
            where: {
                username: dto.username
            }
        })) throw new NotFoundException("User not found")

        await this.prismaService.user.update({
            where: {
                username: dto.username
            },
            data: {
                isBanned: dto.status
            }
        })

        return `User ${dto.status ? "banned": "unbanned"}`
    }
}
