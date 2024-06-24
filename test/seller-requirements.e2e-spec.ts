import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule } from '../src/auth/auth.module';
import { PrismaService } from '../src/prisma.service';
import { RoleEnum } from '@prisma/client';
import * as request from 'supertest';
import { prisma } from '../src/prisma-client.forTest'
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';
import { SellerRequirementsModule } from '../src/seller-requirements/seller-requirements.module';

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

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, SellerRequirementsModule],
            providers: [PrismaService]
        }).overrideGuard(JwtGuard).useValue({
            canActivate: (ctx: ExecutionContext) => {
                const request: Request = ctx.switchToHttp().getRequest()

                request.user = testJwtUser

                return true
            }
        }).compile()

        app = moduleFixture.createNestApplication()
        app.setGlobalPrefix("/api")

        await app.init()
    })

    it("Проверка создания запроса на роль селлера", async () => {
        return request(app.getHttpServer())
        .post("/api/seller-requirements/createSellerRequirement")
        .send(testSellerRequirement)
        .expect(201)
    })

    afterAll(async () => {
        await prisma.sellerRequirement.delete({
            where: {
                userId: testJwtUser.id
            }
        })
    })
})