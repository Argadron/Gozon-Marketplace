import { Test, TestingModule } from '@nestjs/testing';
import { BasketService } from './basket.service';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import { FileService } from '../file.service';
import { ConfigService } from '@nestjs/config';
import prismaTestClient from '../prisma-client.forTest'

const prisma = prismaTestClient()

describe('BasketService', () => {
  let service: BasketService;
  const testAddProduct = {
    productId: 1,
    productCount: 1
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }
  const testJwtDeletor = {
    id: 32,
    role: RoleEnum.USER
  }
  const testNewProduct = {
    name: "продукт!",
    description: "продукт!",
    tags: ["продукт!"],
    price: 2.25,
    count: 5,
  }
  let basketId: number;

  beforeAll(async () => {
    const product = await prisma.product.create({ data: { ...testNewProduct, productPhoto: "default.png", sellerId: 64 } }) 

    const { productId } = await prisma.userProducts.create({ data: { productId: product.id, productCount: 1, userId: 32 } })

    basketId = productId
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
      providers: [BasketService, PrismaService, ProductsService, FileService, ConfigService],
    }).compile();

    service = module.get<BasketService>(BasketService);
  });

  it('Проверка добавления товара в корзину', async () => {
    expect((await service.addProduct(testAddProduct, testJwtUser))).toBeDefined();
  });

  it("Проверка удаления товара из корзины", async () => {
    expect((await service.deleteProduct(basketId, testJwtDeletor)).count).toBeDefined()
  })

  afterAll(async () => {
    await prisma.userProducts.deleteMany({ where: { productId: 1, userId: 3 } })
  })
});
