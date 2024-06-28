import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { Request, Response } from 'express';
import * as request from 'supertest';
import 'dotenv/config'
import { AdminGuard } from '../src/auth/guards/admin.guard';
import { RoleEnum } from '@prisma/client';
import { AlertsService } from '../src/alerts/alerts.service';
import { PrismaService } from '../src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../src/auth/auth.service';
import { FileService } from '../src/file.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtGuard } from '../src/auth/guards/jwt.guard'
import { UsersController } from '../src/users/users.controller';

describe("UsersController (E2E)", () => {
    let app: INestApplication;
    const testBanStatus = {
        status: false,
        username: "Argadron"
    }

    function setAuthorizationRefresh(req: Request, res: Response, next: Function) {
        req.headers.authorization = `Bearer ${process.env.TOKEN}`

        next()
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [PrismaService, AlertsService, AuthService, ConfigService, FileService, UsersService, JwtService]
        }).overrideGuard(AdminGuard).useValue({
            canActivate: (ctx: ExecutionContext) => {
                const request: Request = ctx.switchToHttp().getRequest()

                request.user = {
                    id: 3,
                    role: RoleEnum.ADMIN
                }

                return true
            }
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

    it("Проверка получения профиля пользователя", async () => {
        return request(app.getHttpServer())
        .get("/api/users/getProfile")
        .expect(200)
    })

    it("Проверка получения фото профиля пользователя", async () => {
        return request(app.getHttpServer())
        .get("/api/users/getProfilePhoto")
        .expect(200)
    })

    it("Проверка бана/разбана пользователя", async () => {
        return request(app.getHttpServer())
        .put("/api/users/userBanStatus")
        .send(testBanStatus)
        .expect(200)
    })
})