import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RoleEnum } from '@prisma/client';
import { ProductsModule } from '../products/products.module';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  const testReview = {
    productId: 1,
    name: "отзыв",
    description: "отзыв",
    rate: 1
  }
  const testEditReview = {
    productId: 1,
    name: "отзыв",
    description: "отзыв",
    rate: 1,
    reviewId: 17
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ProductsModule],
      controllers: [ReviewsController],
      providers: [ReviewsService, PrismaService],
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

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('Проверка запроса на создание отзыва к товару', async () => {
    expect((await controller.newReview(testReview, testJwtUser)).createdAt).toBeDefined();
  });

  it("Проверка изменения отзыва у товара", async () => {
    expect((await controller.editReview(testEditReview, testJwtUser)).createdAt).toBeDefined()
  })

  it("Проверка удаления отзыва у товара", async () => {
    expect((await controller.deleteReview(100, testJwtUser)).createdAt).toBeDefined()
  })
});
