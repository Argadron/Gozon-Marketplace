import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma.service';
import { ProductsModule } from '../products/products.module';
import { RoleEnum } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import prismaTestClient from '../prisma-client.forTest'

const prisma = prismaTestClient()

describe('ReportsController', () => {
  let controller: ReportsController;
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }
  const testNewReport = {
    name: "репорт",
    description: "отравился",
    productId: 1
  }
  const testEditReport = {
    name: "репортик",
    reportId: 0
  }
  let reportId: number;

  beforeAll(async () => {
    const { id } = await prisma.report.create({ data: { ...testNewReport, authorId: 3 }  })

    reportId = id
    testEditReport["reportId"] = id
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
      controllers: [ReportsController],
      providers: [ReportsService, PrismaService],
    }).overrideGuard(JwtGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
          const request: Request = ctx.switchToHttp().getRequest()

          request.user = {
              id: 3,
              role: RoleEnum.ADMIN
          }

          return true
    }}).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('Проверка запроса на создание жалобы на продукт', async () => {
    expect((await controller.newReport(testNewReport, testJwtUser)).createdAt).toBeDefined();
  });

  it("Проверка запроса на изменение жалобы на продукт", async () => {
    expect((await controller.editReport(testEditReport, testJwtUser)).updatedAt).toBeDefined()
  })

  it("Проверка запроса на удаление жалобы на продукт", async () => {
    expect((await controller.deleteReport(reportId, testJwtUser)).updatedAt).toBeDefined()
  })
});
