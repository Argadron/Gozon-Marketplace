import { Test, TestingModule } from '@nestjs/testing';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import { FileService } from '../file.service';
import { ConfigService } from '@nestjs/config';
import prismaTestClient from '../prisma-client.forTest'

const prisma = prismaTestClient()

describe('BasketController', () => {
  let controller: BasketController;
  const testAddProduct = {
    productId: 1,
    productCount: 1
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }
  let basketId: number; 
  const testNewProduct = {
    name: "продукт!",
    description: "продукт!",
    tags: ["продукт!"],
    price: 2.25,
    count: 5,
  }
  const testJwtDeletor = {
    id: 32,
    role: RoleEnum.USER
  }

  beforeAll(async () => {
    const product = await prisma.product.create({ data: { ...testNewProduct, productPhoto: "default.png", sellerId: 64 } }) 

    const { productId } = await prisma.userProducts.create({ data: { productId: product.id, productCount: 1, userId: 32 } })

    basketId = productId
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasketController, ProductsModule],
      providers: [BasketService, PrismaService, ProductsService, FileService, ConfigService],
    }).overrideGuard(JwtGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest()

        request.user = {
          id: 3,
          role: RoleEnum.ADMIN
        }

        return true
      }
    }).compile();

    controller = module.get<BasketController>(BasketController);
  });

  it('Проверка добавления товара в корзину', async () => {
    expect((await controller.addProduct(testAddProduct, testJwtUser)).createdAt).toBeDefined();
  });

  it("Проверка удаления товара из корзины", async () => {
    expect((await controller.deleteProduct(basketId, testJwtDeletor)).count).toBeDefined()
  })

  afterAll(async () => {
    await prisma.userProducts.deleteMany({ where: { productId: 1, userId: 3 } })
  })
});
