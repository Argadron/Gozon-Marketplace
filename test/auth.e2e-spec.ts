import { INestApplication } from '@nestjs/common'
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

const prisma = prismaTestClient()

describe("AuthController (E2E)", () => {
    let app: INestApplication;
    const testNewUser = {
        username: "Васек",
        password: "123123123",
        email: "test2424242@mail.ru",
        phone: "+78005121001"
      }

    function setAuthorizationRefresh(req: Request, res: Response, next: Function) {
        req.headers.authorization = `Bearer ${process.env.TOKEN}`

        next()
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, JwtModule.register({
                secret: "secret"
            }), ConfigModule.forRoot()],
            providers: [PrismaService, ConfigService, FileService]
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

    it("/api/auth/refresh (GET) (Проверка рефреша токенов)", async () => {
        return request(app.getHttpServer())
        .get("/api/auth/refresh")
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
    })
})