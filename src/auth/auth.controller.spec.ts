import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { response, Request } from 'express';
import { PrismaService } from '../prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from  '../file.service'
import { JwtModule } from '@nestjs/jwt';
import prismaTestClient from '../prisma-client.forTest'
import 'dotenv/config'
import { AlertsService } from '../alerts/alerts.service';
import { UsersService } from '../users/users.service';
import { RoleEnum } from '@prisma/client';
import { ExecutionContext } from '@nestjs/common';
import { JwtGuard } from './guards/jwt.guard';
import { EmailService } from '../email/email.service'
import { TelegramModule } from '../telegram/telegram.module';

const prisma = prismaTestClient()

describe('AuthController', () => {
  let controller: AuthController;
  const testNewUser = {
    username: "Васек",
    password: "123123123",
    email: "testfgdgdfgdgd@mail.ru",
    phone: "+7800500100"
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }
  const testChangePassword = {
    oldPassword: "123123123",
    newPassword: "123123123"
  }
  const testResetPassword = {
    username: "Argadron1",
    newPassword: "123123123"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        secret: "secret"
    }), ConfigModule.forRoot(), TelegramModule],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, ConfigService, FileService, AlertsService, UsersService, EmailService],
    }).overrideGuard(JwtGuard).useValue({
      canActivate: async (ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest()

        request.user = {
          id: 3,
          role: RoleEnum.ADMIN
        }

        if (await prisma.emailConfirms.findUnique({ where: { userId: 3 } })) await prisma.emailConfirms.delete({ where: { userId: 3 } })

        return true
      }
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Проверка регистрации юзера', async () => {
    expect((await controller.register(response, testNewUser)).access).toBeDefined();
  });

  it("Проверка логина юзера", async () => {
    expect((await controller.login(response, testNewUser)).access).toBeDefined()
  })

  it("Проверка рефреша токенов", async () => {
    expect((await controller.refresh(process.env.TOKEN, response)).access).toBeDefined()
  })

  it("Проверка выхода из аккаунта", async () => {
    expect((await controller.logout(testJwtUser, response)).id).toBeDefined()
  })

  it("Проверка изменения пароля на аккауте", async () => {
    expect((await controller.changePassword(testChangePassword, testJwtUser)).length).toBeDefined()
  })

  it("Проверка сброса пароля на аккаунте", async () => {
    expect((await controller.resetPassword(testResetPassword)).length).toBeDefined()
  })

  afterAll(async () => {
    await prisma.tokens.update({
      where: {
        userId: 3
      },
      data: {
        token: process.env.TOKEN
      }
    })

    const { id } = await prisma.user.findUnique({
      where: {
        username: "Васек"
      }
    })

    await prisma.tokens.delete({
      where: {
        userId: id
      }
    })

    await prisma.user.delete({
      where: {
        username: "Васек"
      }
    })
  })
});
