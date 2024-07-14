import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { response } from 'express';
import { PrismaService } from '../prisma.service';
import { FileService } from '../file.service'
import { ConfigService } from '@nestjs/config';
import { RoleEnum } from '@prisma/client';
import { AlertsModule } from '../alerts/alerts.module';
import prismaTestClient from '../prisma-client.forTest'

const prisma = prismaTestClient()

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
  const testRole = {
    username: "Argadron",
    role: RoleEnum.USER
  }
  const testBlackList = {
    username: "Argadron"
  }

  beforeAll(async () => {
    await prisma.user.update({
      where: {
        id: 3
      },
      data: {
        blackList: [64]
      }
    })
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AlertsModule],
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

  it("Проверка установки роли пользователю", async () => {
    expect((await service.setUserRole(testRole.role, testRole.username)).length).toBeDefined()
  })

  it("Проверка добавления пользователя в черный список", async () => {
    expect((await service.addBlackList(testBlackList, jwtUserTest)).id).toBeDefined()
  })

  it("Проверка удаления пользователя из черного списка", async () => {
    expect((await service.removeBlackList("ArgadronSeller!", jwtUserTest)).id).toBeDefined()
  })

  afterAll(async () => {
    await prisma.user.update({
      where: {
        id: 3
      },
      data: {
        blackList: []
      }
    })
  })
});
