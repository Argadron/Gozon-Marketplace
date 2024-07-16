import { Test, TestingModule } from '@nestjs/testing'
import { TelegramUpdate } from './telegram.update';
import { PrismaService } from '../prisma.service';
import { TelegramService } from './telegram.service';
import { RoleEnum } from '@prisma/client';
import prismaTestClient from '../prisma-client.forTest'
import { UsersModule } from '../users/users.module';
import { Context, Telegraf } from "telegraf";
import { DEFAULT_BOT_NAME } from 'nestjs-telegraf';
import { CategoriesModule } from '../categories/categories.module';
import { AlertsModule } from '../alerts/alerts.module';

const prisma = prismaTestClient()

describe("TelegramService", () => {
    let service: TelegramService;
    const testJwtUser = {
        id: 64,
        role: RoleEnum.SELLER
    } 
    const testDisconnect = {
        password: "123123123"
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UsersModule, CategoriesModule, AlertsModule],
            providers: [TelegramUpdate, PrismaService, TelegramService, {
                provide: DEFAULT_BOT_NAME,
                useValue: Telegraf<Context>
            }]
        }).compile()

        service = module.get<TelegramService>(TelegramService)
    })

    it("Проверка запроса на создание секретного ключа активации", async () => {
        expect((await service.createAuthTag(testJwtUser)).id).toBeDefined()
    })

    it("Проверка запроса на дисконнет аккаунта", async () => {
        expect((await service.disconnect(testDisconnect, testJwtUser))).toBeUndefined()
    })

    afterAll(async () => {
        await prisma.telegramAuth.delete({
            where: {
                userId: 3
            }
        })

        await prisma.user.update({
            where: {
                id: 64
            },
            data: {
                isTelegramVerify: true
            }
        })

        await prisma.telegram.create({
            data: {
                userId: 64,
                telegramId: 5946037728
            }
        })
    })
})