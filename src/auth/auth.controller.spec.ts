import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { response } from 'express';
import { PrismaService } from '../prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from  '../file.service'
import { JwtModule } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  const testNewUser = {
    username: "Васек",
    password: "123123123",
    email: "test@mail.ru",
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
});
