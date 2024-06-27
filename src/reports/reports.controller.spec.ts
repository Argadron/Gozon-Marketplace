import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { RoleEnum } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

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
    reportId: 20
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ProductsModule],
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
});
