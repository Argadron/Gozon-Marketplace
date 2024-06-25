import { Test, TestingModule } from '@nestjs/testing';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RoleEnum } from '@prisma/client';

describe('BasketController', () => {
  let controller: BasketController;
  const testAddProduct = {
    productId: 26,
    productCount: 5
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasketController],
      providers: [BasketService],
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
});
