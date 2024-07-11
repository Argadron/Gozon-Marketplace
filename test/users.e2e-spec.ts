import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { Request, Response } from 'express';
import * as request from 'supertest';
import 'dotenv/config'
import { AdminGuard } from '../src/auth/guards/admin.guard';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from '../src/file.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtGuard } from '../src/auth/guards/jwt.guard'
import { UsersController } from '../src/users/users.controller';
import prismaTestClient from '../src/prisma-client.forTest'
import { AlertsModule } from '../src/alerts/alerts.module';

const prisma = prismaTestClient()

describe("UsersController (E2E)", () => {
    let app: INestApplication;
    const testBanStatus = {
        status: false,
        username: "Argadron"
    }
    const testRole = {
        username: "Argadron",
        role: RoleEnum.USER
      }
      const testBlackList = {
        username: "Argadron"
      }

      beforeAll(async () => {
        await prisma.user.update({
          where: {
            id: 3
          },
          data: {
            blackList: [64]
          }
        })
      })

    function setAuthorizationRefresh(req: Request, res: Response, next: Function) {
        req.headers.authorization = `Bearer ${process.env.TOKEN}`

        next()
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AlertsModule],
            controllers: [UsersController],
            providers: [PrismaService, ConfigService, FileService, UsersService]
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

    it("/api/users/getProfile (GET) (Проверка получения профиля пользователя)", async () => {
        return request(app.getHttpServer())
        .get("/api/users/getProfile")
        .expect(200)
    })

    it("/api/users/getProfilePhoto (GET) (Проверка получения фото профиля пользователя)", async () => {
        return request(app.getHttpServer())
        .get("/api/users/getProfilePhoto")
        .expect(200)
    })

    it("/api/users/userBanStatus (PUT) (Проверка бана/разбана пользователя)", async () => {
        return request(app.getHttpServer())
        .put("/api/users/userBanStatus")
        .send(testBanStatus)
        .expect(200)
    })

    it("/api/users/userRole (PUT) (Проверка установки роли пользователю)", async () => {
        return request(app.getHttpServer())
        .put("/api/users/userRole")
        .send(testRole)
        .expect(200)
    })

    it("/api/users/addToBlacklist (POST) (Проверка добавления пользователя в черный список)", async () => {
        return request(app.getHttpServer())
        .post("/api/users/addToBlacklist")
        .send(testBlackList)
        .expect(200)
    })

    it("/api/users/removeFromBlacklist/${username} (DELETE) (Проверка удаления пользователя из черного списка)", async () => {
        return request(app.getHttpServer())
        .delete("/api/users/removeFromBlacklist/ArgadronSeller!")
        .expect(200)
    })

    afterAll(async () => {
        await prisma.user.update({
          where: {
            id: 3
          },
          data: {
            blackList: []
          }
        })

        await app.close()
    })
})