import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { BlacklistService } from '../src/blacklist/blacklist.service';
import { PrismaService } from '../src/prisma.service';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { RoleEnum } from '@prisma/client';
import { Request } from 'express';
import * as request from 'supertest'
import { BlacklistController } from '../src/blacklist/blacklist.controller';

describe("BlackListController (E2E)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [BlacklistController],
            providers: [BlacklistService, PrismaService]
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

    it("Проверка получения всего blacklist", async () => {
        return request(app.getHttpServer())
        .get("/api/blacklist/get")
        .expect(200)
    })
})