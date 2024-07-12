import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PaymentsController } from '../src/payments/payments.controller';
import { JwtGuard } from '@guards/jwt.guard';
import { PrismaService } from '../src/prisma.service';
import { PaymentsService } from '../src/payments/payments.service';
import { RoleEnum } from '@prisma/client';
import { AdminGuard } from '@guards/admin.guard';
import { Request } from 'express';
import * as request from 'supertest'
import prismaTestClient from '../src/prisma-client.forTest'

const prisma = prismaTestClient()

describe("PaymentsController (E2E)", () => {
    let app: INestApplication;
    let paymentId: number;

    beforeAll(async () => {
      const { id } = await prisma.payments.create({ data: { payUserId: 64, amount: 500 } })
  
      paymentId = id
    })

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [PaymentsController],
            providers: [PaymentsService, PrismaService],
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

    it("/api/payments/all (GET) (Проверка получения всех ожиданий переводов)", async () => {
        return request(app.getHttpServer())
        .get("/api/payments/all")
        .expect(200)
    })

    it("/api/payments/delete/${id} (DELETE) (Проверка удаления ожидания перевода по ID)", async () => {
        return request(app.getHttpServer())
        .delete(`/api/payments/delete/${paymentId}`)
        .expect(200)
    })
})