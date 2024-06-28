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

describe('BasketController', () => {
  let controller: BasketController;
  const testAddProduct = {
    productId: 26,
    productCount: 1
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }

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

  it("Проверка удаленеия товара из корзины", async () => {
    expect((await controller.deleteProduct(5, testJwtUser)).count).toBeDefined()
  })
});
