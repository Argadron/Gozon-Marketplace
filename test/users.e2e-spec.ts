import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UsersModule } from '../src/users/users.module';
import { Request, Response } from 'express';
import * as request from 'supertest';
import 'dotenv/config'
import { AdminGuard } from '../src/auth/guards/admin.guard';
import { RoleEnum } from '@prisma/client';
import { AlertsModule } from '../src/alerts/alerts.module';

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
            imports: [UsersModule, AlertsModule],
        }).overrideGuard(AdminGuard).useValue({
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