import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UsersService } from "../users/users.service";
import { twoFactorAuthEnum } from "@prisma/client";
import { CreateConnect } from "./interfaces";
import * as bcrypt from 'bcrypt'
import { JwtUser } from "../auth/interfaces";
import { v4 } from "uuid";
import { InjectBot } from "nestjs-telegraf";
import { Context, Telegraf } from "telegraf";

@Injectable()
export class TelegramService {
    constructor(private readonly prismaService: PrismaService,
                private readonly usersService: UsersService,
                @InjectBot() private readonly bot: Telegraf<Context>
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
        if (User.isTelegramVerify) return false

        await this.usersService.update({
            isTelegramVerify: true
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

    async enableTwoFactorAuth(User: any) {
        if (!User.isTelegramVerify || User.twoFactorAuth === twoFactorAuthEnum.EMAIL) return false;

        return await this.usersService.update({
            twoFactorAuth: User.twoFactorAuth === twoFactorAuthEnum.TELEGRAM ? twoFactorAuthEnum.NONE : twoFactorAuthEnum.TELEGRAM
        }, User.id)
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

    async createAuthTagExternal(tag: string, userId: number) {
        return await this.prismaService.telegramAuth.create({
            data: {
                userId,
                authToken: tag
            }
        })
    }

    async findTelegramIdByUserId(userId: number) {
        return await this.prismaService.telegram.findUnique({
            where: {
                userId
            }
        })
    }

    async findUserIdByTag(tag: string) {
        return await this.prismaService.telegramAuth.findUnique({
            where: {
                authToken: tag
            }
        })
    }

    async sendMessage(telegramId: any, message: string) {
        return await this.bot.telegram.sendMessage(telegramId.toString(), message)
    }
}