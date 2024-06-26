import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { RoleEnum } from '@prisma/client';

describe('ReviewsService', () => {
  let service: ReviewsService;
  const testReview = {
    productId: 1,
    name: "отзыв",
    description: "отзыв",
    rate: 1
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [ReviewsService, PrismaService],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('Проверка создания отзыва к товару', async () => {
    expect((await service.newReview(testReview, testJwtUser)).createdAt).toBeDefined();
  });
});
