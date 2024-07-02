import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';
import { RoleEnum } from '@prisma/client';
import { ExecutionContext } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { PrismaService } from '../prisma.service';

describe('BlacklistController', () => {
  let controller: BlacklistController;
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlacklistController],
      providers: [BlacklistService, PrismaService],
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

    controller = module.get<BlacklistController>(BlacklistController);
  });

  it('Проверка получения всего blacklist', async () => {
    expect((await controller.getAll(testJwtUser))).toBe(null);
  });
});
