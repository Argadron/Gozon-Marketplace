import { Test, TestingModule } from '@nestjs/testing';
import { SellerRequirementsService } from './seller-requirements.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { prisma } from '../prisma-client.forTest';
import { RoleEnum } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AdminGuard } from '../auth/guards/admin.guard';

describe('SellerRequirementsService', () => {
  let service: SellerRequirementsService;
  const testSellerRequirement = {
    fio: "тест тест тест",
    description: "тесттесттест",
    phone: "+78005003535",
    isCompany: true,
    email: "test@mail.ru"
  }
  const testJwtUser = {
    id: 32,
    role: RoleEnum.USER
  }
  const testQuery = {
    page: 1,
    requirementsOnPage: 1
  }
  const testCloseRequirement = {
    userId: 32,
    accepted: false,
    description: "закрыто"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [SellerRequirementsService, PrismaService],
    }).overrideGuard(JwtGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest()

        request.user = testJwtUser

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

    service = module.get<SellerRequirementsService>(SellerRequirementsService);
  });

  it('Проверка создания запроса на роль селлера', async () => {
    expect((await service.createSellerRequirement(testSellerRequirement, testJwtUser)).createdAt).toBeDefined();
  });

  it("Проверка получения всех запросов на роль селлера", async () => {
    expect((await service.getAll(testQuery)).pages).toBeDefined()
  })

  it("Проверка на закрытие запроса на роль селлера", async () => {
    expect((await service.close(testCloseRequirement)).createdAt).toBeDefined()
  })
});
