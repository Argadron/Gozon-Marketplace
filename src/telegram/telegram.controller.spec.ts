import { Test, TestingModule } from '@nestjs/testing'
import { TelegramController } from './telegram.controller'
import { TelegramUpdate } from './telegram.update';
import { PrismaService } from '../prisma.service';
import { TelegramService } from './telegram.service';
import { ExecutionContext } from '@nestjs/common';
import { JwtGuard } from '@guards/jwt.guard';
import { RoleEnum } from '@prisma/client';
import { Request } from 'express'
import prismaTestClient from '../prisma-client.forTest'
import { UsersModule } from '../users/users.module';
import { TelegramModule } from './telegram.module';
import { DEFAULT_BOT_NAME } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { CategoriesModule } from '../categories/categories.module';
import { AlertsModule } from '../alerts/alerts.module';

const prisma = prismaTestClient()

describe("TelegramController", () => {
    let controller: TelegramController;
    const testJwtUser = {
        id: 64,
        role: RoleEnum.SELLER
    } 
    const testDisconnect = {
        password: "123123123"
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UsersModule, TelegramModule.forRoot(), CategoriesModule, AlertsModule],
            controllers: [TelegramController],
            providers: [TelegramUpdate, PrismaService, TelegramService, {
                provide: DEFAULT_BOT_NAME,
                useValue: Telegraf<Context>
            }]
        }).overrideGuard(JwtGuard).useValue({
            canActivate: (ctx: ExecutionContext) => {
              const request: Request = ctx.switchToHttp().getRequest()
      
              request.user = {
                id: 64,
                role: RoleEnum.SELLER
              }
      
              return true
            }
          }).compile()

        controller = module.get<TelegramController>(TelegramController)
    })

    it("Проверка запроса на создание секретного ключа активации", async () => {
        expect((await controller.createConnect(testJwtUser)).id).toBeDefined()
    })

    it("Проверка деактивации телеграмма", async () => {
        expect((await controller.disconnect(testDisconnect, testJwtUser))).toBeUndefined()
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