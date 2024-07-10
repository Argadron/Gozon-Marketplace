import { Test, TestingModule } from '@nestjs/testing'
import { EmailController } from './email.controller'
import { ExecutionContext } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from '@guards/jwt.guard';
import { Request } from 'express'
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import prismaTestClient from '../prisma-client.forTest'
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { AlertsModule } from '../alerts/alerts.module';
import { v4 } from 'uuid'

const prisma = prismaTestClient()

describe("EmailController", () => {
    let controller: EmailController;
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
        const module: TestingModule = await Test.createTestingModule({
          imports: [UsersModule, AlertsModule],
          controllers: [EmailController],
          providers: [EmailService, ConfigService, PrismaService, JwtService],
        }).overrideGuard(JwtGuard).useValue({
          canActivate: (ctx: ExecutionContext) => {
            const request: Request = ctx.switchToHttp().getRequest()
    
            request.user = {
              id: 64,
              role: RoleEnum.SELLER
            }
    
            return true
          }
        }).compile();
    
        controller = module.get<EmailController>(EmailController);
      });

  it("Проверка отправки письма на подтверждение почты", async () => {
    expect((await controller.createVerification(testJwtUser)).urlTag).toBeDefined()
  })

  it("Проверка валидации тега на подтверждение email", async () => {
    expect((await controller.validateTag(tag))).toBeUndefined()
  })

  afterAll(async () => {
    await prisma.emailConfirms.delete({
        where: {
            userId: 64
        }
    })
})
})