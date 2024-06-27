import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { response } from 'express';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { FileService } from '../file.service'
import { ConfigService } from '@nestjs/config';
import { RoleEnum } from '@prisma/client';
import { AlertsModule } from '../alerts/alerts.module';
import { forwardRef } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  const jwtUserTest = {
    id: 3,
    role: RoleEnum.ADMIN
  }
  const jwtUserTestOnlyId = 3
  const testBan = {
    username: "Argadron",
    status: false
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, forwardRef(() => AlertsModule)],
      providers: [UsersService, PrismaService, FileService, ConfigService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('Проверка получения профиля пользователя', async () => {
    expect((await service.getProfile(jwtUserTestOnlyId)).role).toBeDefined();
  });

  it("Проверка получения профиля пользователя", async () => {
    expect((await service.getProfilePhoto(jwtUserTest, response)).statusCode).toBe(200)
  })

  it("Проверка бана/разбана пользователя", async () => {
    expect((await service.setUserBanStatus(testBan, jwtUserTest)).length).toBeDefined()
  })
});
