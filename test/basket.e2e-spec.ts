import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing'
import { BasketModule } from '../src/basket/basket.module';
import { BasketService } from '../src/basket/basket.service';
import { PrismaService } from '../src/prisma.service';
import * as request from 'supertest'
import { RoleEnum } from '@prisma/client';
import { AuthModule } from '../src/auth/auth.module';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';
import { ProductsModule } from '../src/products/products.module';

describe("BasketController (E2E)", () => {
    let app: INestApplication;
    const testAddProduct = {
        productId: 1,
        productCount: 1
      }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [BasketModule, AuthModule, ProductsModule],
            providers: [BasketService, PrismaService]
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

    it("Проверка добавления товара в корзину", async () => {
        return request(app.getHttpServer())
        .post("/api/basket/addProduct")
        .send(testAddProduct)
        .expect(200)
    })

    it("Проверка удаления товара из корзины", async () => {
        return request(app.getHttpServer())
        .delete("/api/basket/deleteProduct/1")
        .expect(200)
    })
})