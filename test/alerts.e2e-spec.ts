import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AlertsModule } from '../src/alerts/alerts.module';
import { AuthModule } from '../src/auth/auth.module';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { RoleEnum } from '@prisma/client';
import { Request } from 'express'
import { AdminGuard } from '../src/auth/guards/admin.guard';
import * as request from 'supertest'
import prismaTestClient from '../src/prisma-client.forTest'

const prisma = prismaTestClient()

describe("AlertsController (E2E)", () => {
    let app: INestApplication;
    const testAlert = {
        username: "Argadron",
        description: "тебе уведомление!"
      }
      let alertId: number;

      beforeAll(async () => {
        const { id } = await prisma.alert.create({ data: { description: "тебе уведомление", userId: 3 } })

        alertId = id
      })

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AlertsModule, AuthModule]
        }).overrideGuard(JwtGuard).useValue({
            canActivate: (ctx: ExecutionContext) => {
                const request: Request = ctx.switchToHttp().getRequest()
        
                request.user = {
                  id: 3,
                  role: RoleEnum.ADMIN
                }
        
                return true
              }
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

        await app.init()
    })

    it("Проверка запроса на создание уведомления", async () => {
        return request(app.getHttpServer())
        .post("/api/alerts/send")
        .send(testAlert)
        .expect(201)
    })

    it("Проверка запроса на удаление уведомления", async () => {
      return request(app.getHttpServer())
      .delete(`/api/alerts/delete/${alertId}`)
      .expect(200)
    })

    it("Проверка запроса на удаление ВСЕХ уведомлений", async () => {
      return request(app.getHttpServer())
      .delete("/api/alerts/deleteAll")
      .expect(200)
    })

    afterAll(async () => {
      await app.close()
  })
})