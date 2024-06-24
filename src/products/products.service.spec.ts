import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaClient, RoleEnum } from '@prisma/client';
import { FileService } from '../file.service';
import { ConfigService } from '@nestjs/config';

describe('ProductsService', () => {
  let service: ProductsService;
  const query = {
    page: 1,
    productOnPage: 50
  }
  const testNewProduct = {
    name: "продукт",
    description: "продукт",
    tags: ["продукт"],
    price: 2.25,
    count: 5,
  }
  const testSeller = {
    id: 66,
    role: RoleEnum.SELLER
  }
  let id: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [ProductsService, PrismaService, FileService, ConfigService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('Проверка получения всех продуктов (страницы)', async () => {
    expect((await service.getAll(query))).toBeDefined();
  });

  it("Проверка получения продукта по ID", async () => {
    expect ((await service.getById(1))).toBeDefined()
  })

  it("Проверка создания продукта", async () => {
    expect((await service.create(testNewProduct, testSeller)).name).toBeDefined()
  })

  afterAll(async () => {
    const prisma = new PrismaClient()

    await prisma.product.deleteMany({
      where: {
        name: "продукт"
      }
    })
  })
});