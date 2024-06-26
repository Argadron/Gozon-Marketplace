import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AuthModule } from '../auth/auth.module';
import { prisma } from '../prisma-client.forTest';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RoleEnum } from '@prisma/client';
import { AdminGuard } from '../auth/guards/admin.guard';
import { PrismaService } from '../prisma.service';

describe('AlertsController', () => {
  let controller: AlertsController;
  const testAlert = {
    username: "ArgadronSeller!",
    description: "тебе уведомление!"
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [AlertsController],
      providers: [AlertsService, PrismaService],
    }).overrideGuard(JwtGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest()

        request.user = {
          id: 3,
          role: RoleEnum.ADMIN
        }

        return true
      }
    }).overrideGuard(AdminGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest()

        request.user = {
          id: 3,
          role: RoleEnum.ADMIN
        }

        return true
      }
    }).compile();

    controller = module.get<AlertsController>(AlertsController);
  });

  it('Проверка запроса на создание уведомления', async () => {
    expect((await controller.send(testAlert)).userId).toBeDefined();
  });

  it("Проверка запроса на удаление уведомления", async () => {
    expect((await controller.deleteOne(4, testJwtUser))).toBeDefined()
  })

  it("Проверка запроса на удаление ВСЕХ уведомлений", async () => {
    expect((await controller.deleteAll(testJwtUser)).count).toBeDefined()
  })
});
