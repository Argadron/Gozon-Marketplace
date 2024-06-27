import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { response } from 'express';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from  '../file.service'
import { prisma } from '../prisma-client.forTest';
import 'dotenv/config'
import { UsersModule } from '../users/users.module';

describe('AuthService', () => {
  let service: AuthService;
  const testNewUser = {
    username: "Васек2",
    password: "123123123",
    email: "test5464564565456546456456@mail.ru",
    phone: "+7820560101"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        secret: "secret"
    }), ConfigModule.forRoot(), UsersModule],
      providers: [AuthService, PrismaService, ConfigService, FileService],
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
