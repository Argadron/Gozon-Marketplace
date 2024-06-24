import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { RoleEnum } from '@prisma/client';
import { FileService } from '../file.service';
import { ConfigService } from '@nestjs/config';
import { prisma } from '../prisma-client.forTest';

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
  const testUpdateProduct = {
    id: 1,
    count: 8
  }
  const queryFilter = {
    page: 1,
    productOnPage: 1,
    filters: {
      priceMin: 2,
      priceMax: 100,
      tags: ["test"]
    }
  }
  const testSeller = {
    id: 64,
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
    expect((await controller.getAll(query)).pages).toBeDefined();
  });

  it("Проверка получения продуктов с фильтром", async () => {
    expect ((await controller.getAll(queryFilter)).result[0]).toBeDefined()
  })

  it("Проверка получения продукта по ID", async () => {
    expect((await controller.getById(1))).toBeDefined()
  })

  it("Проверка создания продукта", async () => {
    expect((await controller.createProduct(testNewProduct, testSeller)).name).toBeDefined()
  })

  it("Проверка обновления продукта по ID", async () => {
    expect((await controller.editProduct(testUpdateProduct, testSeller)).count).toBeDefined()
  })

  afterAll(async () => {
    await prisma.product.deleteMany({
      where: {
        name: "продукт"
      }
    })
  })
});
