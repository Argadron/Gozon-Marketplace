import { Test, TestingModule } from '@nestjs/testing';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { request, Request } from 'express';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ProductsModule } from '../products/products.module';
import prismaTestClient from '../prisma-client.forTest'
import { PaymentsModule } from '../payments/payments.module';
import { v4 } from 'uuid'
import stripeTestClient from '../stripe.forTest'
import { StripeModule } from '../stripe/stripe.module';
import config from '@config/constants'
import { ConfigService } from '@nestjs/config'
import { AlertsModule } from '../alerts/alerts.module';
import { AuthModule } from '../auth/auth.module';

const prisma = prismaTestClient()
const stripe = stripeTestClient()
const constants = config()

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
  const testJwtSeller = {
    id: 64,
    role: RoleEnum.SELLER
  }
  const testValidate = {
     sessionId: "",
     urlTag: ""
  }
  const testUpdateCount = {
    count: 2
  }
  let testSharedBasketTag: string;

  beforeAll(async () => {
    const product = await prisma.product.create({ data: { ...testNewProduct, productPhoto: "default.png", sellerId: 64 } }) 
    
    const { productId } = await prisma.userProducts.create({ data: { userId: 32, productId: product.id } })

    basketId = productId

    const order = await prisma.orders.create({
      data: { userId: 64, productsInfo: [JSON.stringify({ productId: 1, sellerId: 64, quantity: 1 })], urlTag: v4()}
    })
    const { id } = await stripe.checkout.sessions.create({ line_items: [{ price_data: { unit_amount: 5000, currency: "usd", product_data: { name: "тест" } }, quantity: 1 }], success_url: "http://localhost:3000", cancel_url: "http://localhost:3000", mode: "payment", currency: "usd" })

    testValidate.sessionId = id 
    testValidate.urlTag = order.urlTag

    const testSharedBasket = await prisma.sharedBasket.create({
      data: { userId: 32, url: v4(), productsInfo: [JSON.stringify({ productId: 1, sellerId: 64, quantity: 1 })] }
    })

    testSharedBasketTag = testSharedBasket.url
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule, PaymentsModule, StripeModule.forRoot(constants.STRIPE_API_KEY, { apiVersion: "2024-06-20" }), AlertsModule, AuthModule],
      controllers: [BasketController],
      providers: [BasketService, PrismaService, ConfigService],
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

  it("Проверка обновления количества товара в корзине", async () => {
    expect((await controller.updateProductCount(testAddProduct.productId, testUpdateCount, testJwtUser)).count).toBeDefined()
  })

  it("Проверка формирования заказа", async () => {
    expect((await controller.createOrder(testJwtUser)).sessionId).toBeDefined()
  })

  it("Проверка верификации заказа", async () => {
    expect((await controller.validateOrder(testValidate, testJwtSeller)).length).toBeDefined()
  })

  it("Проверка удаления товара из корзины", async () => {
    expect((await controller.deleteProduct(basketId, testJwtDeletor)).count).toBeDefined()
  })

  it("Проверка создания общедоступной корзины", async () => {
    expect((await controller.copyBasket(testJwtUser)).length).toBeDefined()
  })

  it("Проверка получения общедоступной корзины", async () => {
    expect((await controller.getCopiedBasket(testSharedBasketTag, request)).admin).toBeDefined()
  })

  it("Проверка замены своей корзины на общедоступную", async () => {
    expect((await controller.replaceBasket(testJwtUser, testSharedBasketTag))).toBeUndefined()
  })

  it("Проверка удаления общедоступной корзины", async () => {
    expect((await controller.deleteCopy(testJwtUser, testSharedBasketTag))).toBeUndefined()
  })

  afterAll(async () => {
    await prisma.userProducts.deleteMany({
      where: {
        userId: 3
      }
    })

    await prisma.orders.deleteMany({
      where: {
        OR: [
          { userId: 3 },
          { userId: 64 }
        ]
      }
    })

    await prisma.sharedBasket.deleteMany({
      where: {
        userId: 32
      }
    })
  })
});
