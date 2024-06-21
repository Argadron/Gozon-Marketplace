import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { response } from 'express';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from  '../file.service'

describe('AuthService', () => {
  let service: AuthService;
  const testNewUser = {
    username: "Васек2",
    password: "123123123",
    email: "test2@mail.ru",
    phone: "+7800500101"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        secret: "secret"
    }), ConfigModule.forRoot()],
      providers: [AuthService, PrismaService, ConfigService, FileService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Проверка регистрации юзера', async () => {
    expect((await service.register(response, testNewUser)).access).toBeDefined();
  });
});
