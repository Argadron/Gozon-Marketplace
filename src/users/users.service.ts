import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtUser } from '../auth/interfaces';
import { FileService } from '../file.service';
import { Response } from 'express';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { AlertsService } from '../alerts/alerts.service';
import { CreateUser } from './interfaces';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService,
                private readonly fileService: FileService,
                private readonly alertService: AlertsService
    ) {}

    async getProfile(userId: number) {
        const User = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                userProducts: true,
                reviews: true,
                alerts: true,
                reports: true,
            }
        })

        if (!User) throw new NotFoundException("User not found")

        const globalAlerts = await this.alertService.getMany({ isGlobal: true, NOT: { deletedIds: { has: User.id } } })
        
        for (let i in globalAlerts) {
            delete globalAlerts[i].deletedIds
            delete globalAlerts[i].userId

            User.alerts.push(globalAlerts[i])
        }

        delete User.updatedAt
        delete User.createdAt
        delete User.password

        return User
    }

    async create(data: CreateUser) {
        return await this.prismaService.user.create({
            data
        })
    }

    async findBy(find: any) {
        return await this.prismaService.user.findFirst({ where: find })
    }

    async getProfilePhoto(user: JwtUser, res: Response) {
        const { profilePhoto } = await this.getProfile(user.id)

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
