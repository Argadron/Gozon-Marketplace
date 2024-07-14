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

const prisma = prismaTestClient()

describe("TelegramController", () => {
    let controller: TelegramController;
    const testJwtUser = {
        id: 3,
        role: RoleEnum.ADMIN
    } 

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UsersModule, TelegramModule.forRoot()],
            controllers: [TelegramController],
            providers: [TelegramUpdate, PrismaService, TelegramService, {
                provide: DEFAULT_BOT_NAME,
                useValue: Telegraf<Context>
            }]
        }).overrideGuard(JwtGuard).useValue({
            canActivate: (ctx: ExecutionContext) => {
              const request: Request = ctx.switchToHttp().getRequest()
      
              request.user = {
                id: 3,
                role: RoleEnum.ADMIN
              }
      
              return true
            }
          }).compile()

        controller = module.get<TelegramController>(TelegramController)
    })

    it("Проверка запроса на создание секретного ключа активации", async () => {
        expect((await controller.createConnect(testJwtUser)).id).toBeDefined()
    })

    afterAll(async () => {
        await prisma.telegramAuth.delete({
            where: {
                userId: 3
            }
        })
    })
})