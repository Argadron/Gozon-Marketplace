import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { RoleEnum } from '@prisma/client';
import { ProductsModule } from '../products/products.module';
import prismaTestClient from '../prisma-client.forTest'

const prisma = prismaTestClient()

describe('ReviewsService', () => {
  let service: ReviewsService;
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
    rate: 1
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }

  let reviewId: number; 

  beforeAll(async () => {
    const { id } = await prisma.review.create({ data: { ...testReview, authorId: 3 } })

    reviewId = id
    testEditReview["reviewId"] = id
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ProductsModule],
      providers: [ReviewsService, PrismaService],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('Проверка создания отзыва к товару', async () => {
    expect((await service.newReview(testReview, testJwtUser)).createdAt).toBeDefined();
  });

  it("Проверка изменения отзыва у товара", async () => [
    expect((await service.edit(testEditReview, testJwtUser)).createdAt).toBeDefined()
  ])

  it("Проверка удаления отзыва у товара", async () => {
    expect((await service.delete(reviewId, testJwtUser)).createdAt).toBeDefined()
  })
});
