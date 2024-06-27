import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule } from '../src/auth/auth.module';
import { ProductsModule } from '../src/products/products.module';
import { ReportsModule } from '../src/reports/reports.module';
import { PrismaService } from '../src/prisma.service';
import { RoleEnum } from '@prisma/client';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';
import * as request from 'supertest'

describe("ReportsController (E2E)", () => {
    let app: INestApplication;
    const testJwtUser = {
        id: 3,
        role: RoleEnum.ADMIN
      }
      const testNewReport = {
        name: "репорт",
        description: "отравился",
        productId: 1
      }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, ProductsModule, ReportsModule],
            providers: [PrismaService]
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

    it("Проверка запроса на создание жалобы на продукт", async () => {
        return request(app.getHttpServer())
        .post("/api/reports/new")
        .send(testNewReport)
        .expect(201)
    })
})