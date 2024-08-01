import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing'
import { BasketService } from '../src/basket/basket.service';
import { PrismaService } from '../src/prisma.service';
import * as request from 'supertest'
import { RoleEnum } from '@prisma/client';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';
import { ProductsModule } from '../src/products/products.module';
import { PaymentsModule } from '../src/payments/payments.module';
import { BasketController } from '../src/basket/basket.controller';
import prismaTestClient from '../src/prisma-client.forTest'
import stripeTestClient from '../src/stripe.forTest'
import { v4 } from 'uuid';
import { StripeModule } from '../src/stripe/stripe.module';
import config from '@config/constants'
import { ConfigService } from '@nestjs/config'
import { AlertsModule } from '../src/alerts/alerts.module';

const prisma = prismaTestClient()
const stripe = stripeTestClient()
const constants = config()

describe("BasketController (E2E)", () => {
    let app: INestApplication;
    const testAddProduct = {
        productId: 1,
        productCount: 1
      }
      const testValidate = {
        sessionId: "",
        urlTag: ""
     }
     const testUpdateProductCount = {
        count: 2
     }
   
     beforeAll(async () => {
       const order = await prisma.orders.create({
         data: { userId: 32, productsInfo: [JSON.stringify({ productId: 1, sellerId: 64, quantity: 1 })], urlTag: v4()}
       })
       const { id } = await stripe.checkout.sessions.create({ line_items: [{ price_data: { unit_amount: 5000, currency: "usd", product_data: { name: "тест" } }, quantity: 1 }], success_url: "http://localhost:3000", cancel_url: "http://localhost:3000", mode: "payment", currency: "usd" })
   
       testValidate.sessionId = id 
       testValidate.urlTag = order.urlTag
     })

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ProductsModule, PaymentsModule, StripeModule.forRoot(constants.STRIPE_API_KEY, { apiVersion: "2024-06-20" }), AlertsModule],
            controllers: [BasketController],
            providers: [BasketService, PrismaService, ConfigService]
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

    it("/api/basket/addProduct (POST) (Проверка добавления товара в корзину)", async () => {
        return request(app.getHttpServer())
        .post("/api/basket/addProduct")
        .send(testAddProduct)
        .expect(200)
    })

    it("/api/basket/updateProductCount/${id} (PUT) (Проверка обновления количества товара в корзине)", async () => {
        return request(app.getHttpServer())
        .put(`/api/basket/updateProductCount/${testAddProduct.productId}`)
        .send(testUpdateProductCount)
        .expect(200)
    })

    it("/api/basket/createOrder (POST) (Проверка оформления заказа)", async () => {
        return request(app.getHttpServer())
        .post("/api/basket/createOrder")
        .expect(201)
    })

    it("/api/basket/validateOrder (POST) (Проверка валидации заказа)", async () => {
        return request(app.getHttpServer())
        .post("/api/basket/validateOrder")
        .send(testValidate)
        .expect(403)
    })

    it("/api/basket/deleteProduct/1 (DELETE) (Проверка удаления товара из корзины)", async () => {
        return request(app.getHttpServer())
        .delete("/api/basket/deleteProduct/1")
        .expect(200)
    })

    afterAll(async () => {
        await prisma.orders.deleteMany({
            where: {
                OR: [
                    { userId: 3 },
                    { userId: 32 }
                ]
            }
        })

        await app.close()
    })
})