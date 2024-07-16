import { Test, TestingModule } from '@nestjs/testing'
import { TelegramController } from '../src/telegram/telegram.controller'
import { TelegramUpdate } from '../src/telegram/telegram.update';
import { PrismaService } from '../src//prisma.service';
import { TelegramService } from '../src/telegram/telegram.service';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { JwtGuard } from '@guards/jwt.guard';
import { RoleEnum } from '@prisma/client';
import { Request } from 'express'
import prismaTestClient from '../src/prisma-client.forTest'
import * as request from 'supertest'
import { UsersModule } from '../src/users/users.module'
import { DEFAULT_BOT_NAME } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { CategoriesModule } from '../src/categories/categories.module';
import { TelegramModule } from '../src/telegram/telegram.module';
import { AlertsModule } from '../src/alerts/alerts.module';

const prisma = prismaTestClient()

describe("TelegramController", () => {
    let app: INestApplication;
    const testJwtUser = {
        id: 64,
        role: RoleEnum.SELLER
    } 
    const testDisconnect = {
        password: "123123123"
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule, CategoriesModule, TelegramModule, AlertsModule],
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

        app = moduleFixture.createNestApplication()
        app.setGlobalPrefix("/api")

        await app.init()
    })

    it("/api/telegram/createConnect (POST) (Проверка запроса на создание секретного ключа активации)", async () => {
        return request(app.getHttpServer())
        .post("/api/telegram/createConnect")
        .expect(201)
    })

    it("/api/telegram/disconnect (DELETE) (Проверка дисконнекта аккаунта)", async () => {
        return request(app.getHttpServer())
        .delete("/api/telegram/disconnect")
        .send(testDisconnect)
        .expect(400)
    })

    afterAll(async () => {
        await prisma.telegramAuth.delete({
            where: {
                userId: 64
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

        await app.close()
    })
})