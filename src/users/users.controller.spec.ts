import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Request, response } from 'express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { FileService } from '../file.service'
import { ConfigService } from '@nestjs/config';
import { RoleEnum } from '@prisma/client';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AlertsModule } from '../alerts/alerts.module';

describe('UsersController', () => {
  let controller: UsersController;
  const jwtUserTest = {
    id: 3,
    role: RoleEnum.ADMIN
  }
  const testBan = {
    username: "Argadron",
    status: true
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, forwardRef(() => AlertsModule)],
      controllers: [UsersController],
      providers: [UsersService, PrismaService, FileService, ConfigService],
    }).overrideGuard(JwtGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const req: Request = ctx.switchToHttp().getRequest()

        req.user = {
          id: 3
        }

        return true
      }
    }).overrideGuard(AdminGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const req: Request = ctx.switchToHttp().getRequest()

        req.user = {
          id: 3,
          role: RoleEnum.ADMIN
        }

        return true
      }
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('Проверка получения профиля пользователя', async () => {
    expect((await controller.getProfile(jwtUserTest)).role).toBeDefined();
  });

  it("Проверка получения фото профиля пользователя", async () => {
    expect((await controller.getProfilePhoto(jwtUserTest, response)).statusCode).toBe(200)
  })

  it("Проверка бана/разбана пользователя", async () => {
    expect((await controller.setUserBanStatus(testBan, jwtUserTest)).length).toBeDefined()
  })
});
