import { Test, TestingModule } from '@nestjs/testing';
import { BasketService } from './basket.service';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ProductsModule } from '../products/products.module';
import prismaTestClient from '../prisma-client.forTest'
import { PaymentsModule } from '../payments/payments.module';
import { v4 } from 'uuid';
import stripeTestClient from '../stripe.forTest'
import { StripeModule } from '../stripe/stripe.module';
import config from '@config/constants'
import { ConfigService } from '@nestjs/config'

const prisma = prismaTestClient()
const stripe = stripeTestClient()
const constants = config()

describe('BasketService', () => {
  let service: BasketService;
  const testAddProduct = {
    productId: 1,
    productCount: 1
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }
  const testJwtDeletor = {
    id: 32,
    role: RoleEnum.USER
  }
  const testNewProduct = {
    name: "продукт!",
    description: "продукт!",
    tags: ["продукт!"],
    price: 2.25,
    count: 5,
  }
  let basketId: number;
  const testValidate = {
    sessionId: "",
    urlTag: ""
 }

 beforeAll(async () => {
   const product = await prisma.product.create({ data: { ...testNewProduct, productPhoto: "default.png", sellerId: 64 } }) 

   const { productId } = await prisma.userProducts.create({ data: { productId: product.id, productCount: 1, userId: 32 } })

   basketId = productId


   const order = await prisma.orders.create({
     data: { userId: 32, productsInfo: [JSON.stringify({ productId, sellerId: 64, quantity: 1 })], urlTag: v4()}
   })
   const { id } = await stripe.checkout.sessions.create({ line_items: [{ price_data: { unit_amount: 5000, currency: "usd", product_data: { name: "тест" } } , quantity: 1}], success_url: "http://localhost:3000", cancel_url: "http://localhost:3000", mode: "payment", currency: "usd" })

   testValidate.sessionId = id 
   testValidate.urlTag = order.urlTag
 })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule, PaymentsModule, StripeModule.forRoot(constants.STRIPE_API_KEY, { apiVersion: "2024-06-20" })],
      providers: [BasketService, PrismaService, ConfigService]
    }).compile();

    service = module.get<BasketService>(BasketService);
  });

  it('Проверка добавления товара в корзину', async () => {
    expect((await service.addProduct(testAddProduct, testJwtUser))).toBeDefined();
  });

  it("Проверка оформления заказа", async () => {
    expect((await service.createOrder(testJwtUser)).sessionId).toBeDefined()
  })

  it("Проверка верификации заказа", async () => {
    expect((await service.validateOrder(testValidate, testJwtDeletor)).length).toBeDefined()
  })

  it("Проверка удаления товара из корзины", async () => {
    expect((await service.deleteProduct(basketId, testJwtDeletor)).count).toBeDefined()
  })

  afterAll(async () => {
    await prisma.userProducts.deleteMany({ where: { productId: 1, userId: 3 } })

    await prisma.orders.delete({
      where: {
        userId: 3
      }
    })
  })
});
