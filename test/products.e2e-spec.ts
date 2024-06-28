import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ProductsModule } from '../src/products/products.module';
import { PrismaService } from '../src/prisma.service';
import * as request from 'supertest'
import { FileService } from '../src/file.service';
import { RoleEnum } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';
import { SellerGuard } from '../src/auth/guards/seller.guard';
import prismaTestClient from '../src/prisma-client.forTest'

const prisma = prismaTestClient()

describe("ProductsController (E2E)", () => {
    let app: INestApplication;
    const testNewProduct = {
        name: "продукт",
        description: "продуктtesetestestest",
        tags: ["продукт"],
        price: 5,
        count: 5,
      }
      const testUpdateProduct = {
        id: 1,
        count: 8
      }

      let productId: number; 

      beforeAll(async () => {
        const { id } = await prisma.product.create({ data: { ...testNewProduct, productPhoto: "default.png", sellerId: 64 } })

        productId = id
      })

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ProductsModule],
            providers: [PrismaService, FileService, ConfigService]
        }).overrideGuard(JwtGuard).useValue({
            canActivate: (ctx: ExecutionContext) => {
                const request: Request = ctx.switchToHttp().getRequest()

                request.user = {
                    id: 66,
                    role: RoleEnum.ADMIN
                }
                return true
            }
        }).overrideGuard(SellerGuard).useValue({
            canActivate: (ctx: ExecutionContext) => {
                const request: Request = ctx.switchToHttp().getRequest()

                request.user = {
                    id: 64,
                    role: RoleEnum.SELLER
                }

                return true
            }
        }).compile()

        app = moduleFixture.createNestApplication()
        app.setGlobalPrefix("/api")

        await app.init()
    })

    it("Проверка получения всех продуктов (страницы)", async () => {
        return request(app.getHttpServer())
        .get("/api/products/all?page=1&productOnPage=1")
        .expect(200)
    })

    it("Проверка получения продуктов с фильтром", async () => {
        return request(app.getHttpServer())
        .get("/api/products/all?page=1&productOnPage=1&filters=priceMin=1+priceMax=5+tags=['test']")
        .expect(200)
    })

    it("Проверка получения продукта по ID", async () => {
        return request(app.getHttpServer())
        .get("/api/products/1")
        .expect(200)
    })

    it("Проверка получения фото продукта по ID", async () => {
        return request(app.getHttpServer())
        .get("/api/products/photo/1")
        .expect(200)
    })

    it("Проверка создания продукта", async () => {
        return request(app.getHttpServer())
        .post("/api/products/newProduct")
        .send(testNewProduct)
        .expect(201)
    })

    it("Проверка обновления продукта", async () => {
        return request(app.getHttpServer())
        .put("/api/products/updateProduct")
        .send(testUpdateProduct)
        .expect(200)
    })

    it("Проверка удаления продукта", async () => {
        return request(app.getHttpServer())
        .delete(`/api/products/delete/${productId}`)
        .expect(200)
    })

    afterAll(async () => {
        await prisma.product.deleteMany({
          where: {
            name: "продукт"
          }
        })
      })
})