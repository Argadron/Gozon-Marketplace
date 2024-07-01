import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Request, response } from 'express';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from  '../file.service'
import prismaTestClient from '../prisma-client.forTest'
import 'dotenv/config'
import { UsersService } from '../users/users.service';
import { AlertsService } from '../alerts/alerts.service';
import { RoleEnum } from '@prisma/client';
import { JwtGuard } from './guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';

const prisma = prismaTestClient()

describe('AuthService', () => {
  let service: AuthService;
  const testNewUser = {
    username: "Васек2",
    password: "123123123",
    email: "test5464564565456546456456@mail.ru",
    phone: "+7820560101"
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        secret: "secret"
    }), ConfigModule.forRoot()],
      providers: [AuthService, PrismaService, ConfigService, FileService, UsersService, AlertsService],
    }).overrideGuard(JwtGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest()

        request.user = {
          id: 3,
          role: RoleEnum.ADMIN
        }

        return true
      }
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Проверка регистрации юзера', async () => {
    expect((await service.register(response, testNewUser)).access).toBeDefined();
  });

  it("Проверка логина юзера", async () => {
    expect((await service.login(response, testNewUser)).access).toBeDefined()
  })

  it("Проверка рефреша токенов", async () => {
    expect((await service.refresh(process.env.TOKEN, response)).access).toBeDefined()
  })

  it("Проверка выхода из аккаунта", async () => {
    expect((await service.logout(testJwtUser, response)).id).toBeDefined()
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
        username: "Васек2"
      }
    })

    await prisma.tokens.delete({
      where: {
        userId: id
      }
    })

    await prisma.user.delete({
        where: {
          username: "Васек2"
        }
    })
  })
});
