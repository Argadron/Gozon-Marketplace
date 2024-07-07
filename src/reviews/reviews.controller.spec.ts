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
import prismaTestClient from '../prisma-client.forTest'

const prisma = prismaTestClient()

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
    reviewId: 0
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }
  let reviewId: number; 

  beforeAll(async () => {
    const { id } = await prisma.review.create({ data: { ...testReview, authorId: 3 } })

    reviewId = id
    testEditReview.reviewId = id
  })

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
    expect((await controller.deleteReview(reviewId, testJwtUser)).createdAt).toBeDefined()
  })
});
