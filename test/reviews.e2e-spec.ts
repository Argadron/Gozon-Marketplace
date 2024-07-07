import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule } from '../src/auth/auth.module';
import { ReviewsModule } from '../src/reviews/reviews.module';
import { ReviewsService } from '../src/reviews/reviews.service';
import { PrismaService } from '../src/prisma.service';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { RoleEnum } from '@prisma/client';
import { Request } from 'express';
import * as request from 'supertest'
import { ProductsModule } from '../src/products/products.module';
import prismaTestClient from '../src/prisma-client.forTest'
import { ReviewsController } from '../src/reviews/reviews.controller';

const prisma = prismaTestClient()

describe("ReviewsController (E2E)", () => {
    let app: INestApplication;
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
      let reviewId: number; 

      beforeAll(async () => {
        const { id } = await prisma.review.create({ data: { ...testReview, authorId: 3 } })

        reviewId = id
        testEditReview["reviewId"] = id
      })

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, ReviewsModule, ProductsModule],
            controllers: [ReviewsController],
            providers: [ReviewsService, PrismaService]
        }).overrideGuard(JwtGuard).useValue({
            canActivate: (ctx: ExecutionContext) => {
                const request: Request = ctx.switchToHttp().getRequest()

                request.user = {
                    id: 3,
                    role: RoleEnum.ADMIN
                }

                return true
            }
        }).compile()

        app = moduleFixture.createNestApplication()
        app.setGlobalPrefix("/api")

        await app.init()
    })

    it("/api/reviews/new (POST) (Проверка запроса на создание отзыва)", async () => {
        return request(app.getHttpServer())
        .post("/api/reviews/new")
        .send(testReview)
        .expect(201)
    })

    it("/api/reviews/edit (PUT) (Проверка запроса на изменение отзыва)", async () => {
        return request(app.getHttpServer())
        .put("/api/reviews/edit")
        .send(testEditReview)
        .expect(200)
    })

    it("/api/reviews/delete/${reviewId} (DELETE) (Проверка запроса на удаление отзыва)", async () => {
        return request(app.getHttpServer())
        .delete(`/api/reviews/delete/${reviewId}`)
        .expect(200)
    })

    afterAll(async () => {
        await app.close()
    })
})