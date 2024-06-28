import { Test, TestingModule } from '@nestjs/testing';
import { SellerRequirementsService } from './seller-requirements.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { RoleEnum } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersModule } from '../users/users.module';
import prismaTestClient from '../prisma-client.forTest'

const prisma = prismaTestClient()

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
    id: 3,
    role: RoleEnum.ADMIN
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
  const duplicateTestCloseRequirement = {
    fio: "тест тест тест",
    description: "тесттесттест",
    phone: "+78005003535",
    isCompany: true,
    email: "test@mail.ru"
  }
  beforeAll(async () => {
    await prisma.sellerRequirement.create({ data: { ...duplicateTestCloseRequirement, userId: 32} })
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule],
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

  afterAll(async () => {
    await prisma.sellerRequirement.deleteMany({ where: { userId: 3 } })
  })
});
