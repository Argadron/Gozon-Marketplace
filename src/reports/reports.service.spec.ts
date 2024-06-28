import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { RoleEnum } from '@prisma/client';
import { ProductsModule } from '../products/products.module';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import prismaTestClient from '../prisma-client.forTest'

const prisma = prismaTestClient()

describe('ReportsService', () => {
  let service: ReportsService;
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
    name: "репортик"
  }
  let reportId: number; 

  beforeAll(async () => {
    const { id } = await prisma.report.create({ data: { ...testNewReport, authorId: 3 } })

    reportId = id
    testEditReport["reportId"] = id
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ProductsModule],
      providers: [ReportsService, PrismaService],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('Проверка создания жалобы на продукт', async () => {
    expect((await service.create(testNewReport, testJwtUser)).createdAt).toBeDefined();
  });

  it("Проверка изменения жалобы на продукт", async () => {
    expect((await service.edit(testEditReport, testJwtUser)).updatedAt).toBeDefined()
  })

  it("Проверка удаления жалобы на продукт", async () => {
    expect((await service.delete(reportId, testJwtUser)).updatedAt).toBeDefined()
  })
});
