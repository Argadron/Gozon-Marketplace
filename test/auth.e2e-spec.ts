import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule } from '../src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../src/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from  '../src/file.service'
import * as request from 'supertest';
import { Request, Response } from 'express';
import 'dotenv/config'
import prismaTestClient from '../src/prisma-client.forTest'
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { RoleEnum } from '@prisma/client';
import { EmailModule } from '../src/email/email.module'

const prisma = prismaTestClient()

describe("AuthController (E2E)", () => {
    let app: INestApplication;
    const testNewUser = {
        username: "Васек",
        password: "123123123",
        email: "test2424242@mail.ru",
        phone: "+78005121001"
      }
      const testChangePassword = {
        oldPassword: "123123123",
        newPassword: "123123123"
      }

    function setAuthorizationRefresh(req: Request, res: Response, next: Function) {
        req.headers.authorization = `Bearer ${process.env.TOKEN}`

        next()
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, JwtModule.register({
                secret: "secret"
            }), ConfigModule.forRoot(), EmailModule],
            providers: [PrismaService, ConfigService, FileService]
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
        app.use(setAuthorizationRefresh)

        await app.init()
    })

    it("/api/auth/register (POST) (Проверка регистрации юзера)", async () => {
        return request(app.getHttpServer())
        .post("/api/auth/register")
        .send(testNewUser)
        .expect(201)
    })

    it("/api/auth/login (POST) (Проверка логина юзера)", async () => {
        return request(app.getHttpServer())
        .post("/api/auth/login")
        .send(testNewUser)
        .expect(200)
    })

    it("/api/auth/logout (GET) (Проверка выхода из аккаунта)", async () => {
        return request(app.getHttpServer())
        .get("/api/auth/logout")
        .expect(200)
    })

    it("/api/auth/changepassword (PUT) (Проверка смены пароля)", async () => {
      return request(app.getHttpServer())
      .put("/api/auth/changepassword")
      .send(testChangePassword)
      .expect(200)
    })

    afterAll(async () => {
        await prisma.tokens.update({
            where: {
                userId: 3
            },
            data: {
                token: process.env.TOKEN
            }
        })

        const { id } = await prisma.user.findUnique({
            where: {
              username: "Васек"
            }
          })
      
          await prisma.tokens.delete({
            where: {
              userId: id
            }
          })

        await prisma.user.delete({
            where: {
                username: "Васек"
            }
        })

        await app.close()
    })
})