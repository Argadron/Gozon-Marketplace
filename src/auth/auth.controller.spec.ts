import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { response } from 'express';
import { PrismaService } from '../prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from  '../file.service'
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  const testNewUser = {
    username: "Васек",
    password: "123123123",
    email: "testfgdgdfgdgd@mail.ru",
    phone: "+7800500100"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        secret: "secret"
    }), ConfigModule.forRoot()],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, ConfigService, FileService],
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
    expect((await controller.refresh("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzE5MDQyMDgyLCJleHAiOjE3MjE2MzQwODJ9.9CscTdrQLqZswjoDzvoFD2oxASELaluIteOoT7TaKLU", response)).access).toBeDefined()
  })

  afterAll(async () => {
    const prisma = new PrismaClient()

    await prisma.tokens.update({
      where: {
        userId: 3
      },
      data: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzE5MDQyMDgyLCJleHAiOjE3MjE2MzQwODJ9.9CscTdrQLqZswjoDzvoFD2oxASELaluIteOoT7TaKLU"
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
