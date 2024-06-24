import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { RoleEnum } from '@prisma/client';
import { FileService } from '../file.service';
import { ConfigService } from '@nestjs/config';
import { prisma } from '../prisma-client.forTest';
import { response } from 'express';
import { StringToArrayPipe } from '../common/pipes/string-to-array-pipe';

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
  const testUpdateProduct = {
    id: 1,
    count: 8
  }
  let id: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [ProductsService, PrismaService, FileService, ConfigService, StringToArrayPipe],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('Проверка получения всех продуктов (страницы)', async () => {
    expect((await service.getAll(query)).pages).toBeDefined();
  });

  it("Проверка получения всех продуктов с фильтром", async () => {
    expect((await service.getAll(queryFilter)).result[0]).toBeDefined()
  })

  it("Проверка получения продукта по ID", async () => {
    expect ((await service.getById(1))).toBeDefined()
  })

  it("Проверка получения фото продукта по ID", async () => {
    expect((await service.getPhotoById(1, response))).toBeDefined()
  })

  it("Проверка создания продукта", async () => {
    expect((await service.create(testNewProduct, testSeller)).name).toBeDefined()
  })

  it("Проверка обновления продукта", async () => {
    expect((await service.update(testUpdateProduct, testSeller)).count).toBeDefined()
  })
  
  it("Проверка удаления продукта", async () => {
    expect((await service.delete(50, testSeller))).toBeDefined()
  })

  afterAll(async () => {


    await prisma.product.deleteMany({
      where: {
        name: "продукт"
      }
    })
  })
});
