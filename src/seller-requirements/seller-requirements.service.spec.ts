import { Test, TestingModule } from '@nestjs/testing';
import { SellerRequirementsService } from './seller-requirements.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { prisma } from '../prisma-client.forTest';
import { RoleEnum } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

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
    }).compile();

    service = module.get<SellerRequirementsService>(SellerRequirementsService);
  });

  it('Проверка создания запроса на роль селлера', async () => {
    expect((await service.createSellerRequirement(testSellerRequirement, testJwtUser)).createdAt).toBeDefined();
  });

  it("Проверка получения всех запросов на роль селлера", async () => {
    expect((await service.getAll(testQuery)).pages).toBeDefined()
  })

  beforeAll(async () => {
    if (await prisma.sellerRequirement.findUnique({ where: { userId: testJwtUser.id } })) {
      await prisma.sellerRequirement.delete({
        where: {
          userId: testJwtUser.id
        }
      })
    }
  })
});
