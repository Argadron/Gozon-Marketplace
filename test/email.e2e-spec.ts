import { ExecutionContext, INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing'
import { EmailController } from '../src/email/email.controller';
import { EmailService } from '../src/email/email.service';
import { PrismaService } from '../src/prisma.service';
import { UsersModule } from '../src/users/users.module';
import * as request from 'supertest'
import { RoleEnum } from '@prisma/client';
import { JwtGuard } from '@guards/jwt.guard';
import { Request } from 'express'
import prismaTestClient from '../src/prisma-client.forTest'
import { JwtService } from '@nestjs/jwt';
import { AlertsModule } from '../src/alerts/alerts.module';
import { v4 } from 'uuid'

const prisma = prismaTestClient()

describe("EmailController (E2E)", () => {
    let app: INestApplication;
    const testJwtUser = {
        id: 64,
        role: RoleEnum.SELLER
    }
    let tag: string;

    beforeAll(async () => {
        const { urlTag } = await prisma.emailConfirms.create({
            data: { userId: 3, urlTag: v4() }
          })
  
        tag = urlTag
    })

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule, AlertsModule],
            controllers: [EmailController],
            providers: [EmailService, PrismaService, ConfigService, JwtService]
        }).overrideGuard(JwtGuard).useValue({
            canActivate: (ctx: ExecutionContext) => {
              const request: Request = ctx.switchToHttp().getRequest()
      
              request.user = {
                id: 64,
                role: RoleEnum.SELLER
              }
      
              return true
            }
          }).compile()

        app = moduleFixture.createNestApplication()
        app.setGlobalPrefix("/api")

        await app.init()
    })

    it("Проверка создания письма на верифакцию почту", async () => {
        return request(app.getHttpServer())
        .post("/api/email/createVerification")
        .send(testJwtUser)
        .expect(201)
    })

    it("Проверка верификации тега почты", async () => {
        return request(app.getHttpServer())
        .get(`/api/email/verifyEmailConfirmTag/?urlTag=${tag}`)
        .expect(204)
    })

    afterAll(async () => {
        await prisma.emailConfirms.delete({
            where: {
                userId: 64
            }
        })
        await app.close()
    })
})