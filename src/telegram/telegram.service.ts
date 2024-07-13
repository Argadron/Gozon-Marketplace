import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UsersService } from "../users/users.service";
import { twoFactorAuthEnum } from "@prisma/client";
import { createAuthTag, CreateConnect } from "./interfaces";
import * as bcrypt from 'bcrypt'
import { JwtUser } from "../auth/interfaces";
import { v4 } from "uuid";

@Injectable()
export class TelegramService {
    constructor(private readonly prismaService: PrismaService,
                private readonly usersService: UsersService
    ) {}

    private async getUserByTelegramId(telegramId: number) {
        const candidate = await this.prismaService.telegram.findUnique({
            where: {
                telegramId
            }
        })

        return candidate ? await this.usersService.findBy({ id: candidate.userId }) : null
    }

    private async connector(User: any, telegramId: number) {
        await this.usersService.update({
            isTelegramVerify: true,
            twoFactorAuth: twoFactorAuthEnum.TELEGRAM
        }, User.id)
        await this.prismaService.telegram.create({
            data: {
                userId: User.id,
                telegramId
            }
        })

        return {
            id: User.id,
            role: User.role
        }
    }

    async enableTwoAuthFromQuery(queryAuthToken: string, telegramId: number) {
        const authObject = await this.prismaService.telegramAuth.findUnique({
            where: {
                authToken: queryAuthToken
            }
        })

        if (!authObject) return undefined

        await this.prismaService.telegramAuth.delete({
            where: {
                authToken: queryAuthToken
            }
        })

        return await this.usersService.update({
            twoFactorAuth: twoFactorAuthEnum.TELEGRAM
        }, authObject.userId)
    }

    async createUserConnect(data?: CreateConnect) {
        const User = await this.usersService.findBy({ username: data.username })

        if (!User) return false 

        if (!await bcrypt.compare(data.password, User.password)) return false

        return await this.connector(User, data.telegramId)
    }

    async createAuthTag(user: JwtUser) {
        if (await this.findAuthTagByUserId(user.id)) throw new ConflictException("Already has auth tag")

        return await this.prismaService.telegramAuth.create({
            data: {
                userId: user.id,
                authToken: v4()
            }
        })
    }

    async findAuthTagByUserId(userId: number) {
        return await this.prismaService.telegramAuth.findUnique({
            where: {
                userId
            }
        })
    }

    async deleteAuthTagByUserId(userId: number) {
        return await this.prismaService.telegramAuth.delete({
            where: {
                userId
            }
        })
    }

    async findUserByTelegramId(telegramId: number) {
        const candidate = await this.prismaService.telegram.findUnique({
            where: {
                telegramId
            }
        })

        if (!candidate) return false 

        return await this.usersService.findBy({ id: candidate.userId })
    }

    async logout(telegramId: number) {
        const User = await this.getUserByTelegramId(telegramId)

        if (!User) return false

        await this.prismaService.telegram.delete({
            where: {
                userId: User.id
            }
        })

        await this.usersService.update({
            twoFactorAuth: twoFactorAuthEnum.NONE,
            isTelegramVerify: false
        }, User.id)

        return "Success"
    }

    async createUserConnectWithKey(key: string, telegramId: number) {
        const authObject = await this.prismaService.telegramAuth.findUnique({
            where: {
                authToken: key
            }
        })

        if (!authObject) return false;

        const User = await this.usersService.findBy({ id: authObject.userId })

        await this.prismaService.telegramAuth.delete({
            where: {
                userId: User.id
            }
        })
        
        return await this.connector(User, telegramId)
    }
}