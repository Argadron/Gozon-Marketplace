import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule } from '../src/auth/auth.module';
import { PrismaService } from '../src/prisma.service';
import { RoleEnum } from '@prisma/client';
import * as request from 'supertest';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';
import { SellerRequirementsModule } from '../src/seller-requirements/seller-requirements.module';
import { UsersModule } from '../src/users/users.module';
import { RolesGuard } from '@guards/roles.guard';

describe("Seller-requirementsController (E2E)", () => {
    let app: INestApplication;
    const testSellerRequirement = {
        fio: "тест тест тест",
        description: "тесттесттест",
        phone: "+78005003535",
        isCompany: true,
        email: "test@mail.ru"
      }
      const testJwtUser = {
        id: 32,
        role: RoleEnum.USER
      }
      const testCloseRequirement = {
        userId: 32,
        accepted: false,
        description: "закрыто"
      }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, SellerRequirementsModule, UsersModule],
            providers: [PrismaService]
        }).overrideGuard(JwtGuard).useValue({
            canActivate: (ctx: ExecutionContext) => {
                const request: Request = ctx.switchToHttp().getRequest()

                request.user = testJwtUser

                return true
            }
        }).overrideGuard(RolesGuard).useValue({
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

    it("/api/seller-requirements/createSellerRequirement (POST) (Проверка создания запроса на роль селлера)", async () => {
        return request(app.getHttpServer())
        .post("/api/seller-requirements/createSellerRequirement")
        .send(testSellerRequirement)
        .expect(201)
    })

    it("/api/seller-requirements/all?page=1&requirementsOnPage=1 (GET) (Проверка получения всех запросов на роль селлера)", async () => {
        return request(app.getHttpServer())
        .get("/api/seller-requirements/all?page=1&requirementsOnPage=1")
        .expect(200)
    })

    it("/api/seller-requirements/closeRequirement (PUT) (Проверка закрытия запроса на роль селлера)", async () => {
        return request(app.getHttpServer())
        .put("/api/seller-requirements/closeRequirement")
        .send(testCloseRequirement)
        .expect(200)
    })

    afterAll(async () => {
        await app.close()
    })
})