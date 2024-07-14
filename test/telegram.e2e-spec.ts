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

const prisma = prismaTestClient()

describe("TelegramController", () => {
    let app: INestApplication;
    const testJwtUser = {
        id: 3,
        role: RoleEnum.ADMIN
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule],
            controllers: [TelegramController],
            providers: [TelegramUpdate, PrismaService, TelegramService]
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

        app = moduleFixture.createNestApplication()
        app.setGlobalPrefix("/api")

        await app.init()
    })

    it("/api/telegram/createConnect (POST) (Проверка запроса на создание секретного ключа активации)", async () => {
        return request(app.getHttpServer())
        .post("/api/telegram/createConnect")
        .expect(201)
    })

    afterAll(async () => {
        await prisma.telegramAuth.delete({
            where: {
                userId: 3
            }
        })

        await app.close()
    })
})