import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaClient, RoleEnum } from '@prisma/client';
import { FileService } from '../file.service';
import { ConfigService } from '@nestjs/config';

describe('ProductsController', () => {
  let controller: ProductsController;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [ProductsController],
      providers: [ProductsService, PrismaService, FileService, ConfigService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('Проверка получения всех продуктов (страницы)', async () => {
    expect((await controller.getAll(query))).toBeDefined();
  });

  it("Проверка получения продукта по ID", async () => {
    expect((await controller.getById(1))).toBeDefined()
  })

  it("Проверка создания продукта", async () => {
    expect((await controller.createProduct(testNewProduct, testSeller)).name).toBeDefined()
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
