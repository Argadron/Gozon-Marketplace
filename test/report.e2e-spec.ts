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
import prismaTestClient from '../src/prisma-client.forTest'

const prisma = prismaTestClient()

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
      const testEditReport = {
        name: "репортик"
      }
      let reportId: number; 

      beforeAll(async () => {
        const { id } = await prisma.report.create({ data: { ...testNewReport, authorId: 3 } })

        reportId = id
        testEditReport["reportId"] = id
      })

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

    it("/api/reports/new (POST) (Проверка запроса на создание жалобы на продукт)", async () => {
        return request(app.getHttpServer())
        .post("/api/reports/new")
        .send(testNewReport)
        .expect(201)
    })

    it("/api/reports/edit (PUT) (Проверка запроса на изменение жалобы на продукт)", async () => {
        return request(app.getHttpServer())
        .put("/api/reports/edit")
        .send(testEditReport)
        .expect(200)
    })

    it("/api/reports/delete/${reportId} (DELETE) (Проверка запроса на удаление жалобы на продукт)", async () => {
        return request(app.getHttpServer())
        .delete(`/api/reports/delete/${reportId}`)
        .expect(200)
    })

    afterAll(async () => {
        await app.close()
    })
})