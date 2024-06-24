import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ProductsModule } from '../src/products/products.module';
import { PrismaService } from '../src/prisma.service';
import * as request from 'supertest'
import { FileService } from '../src/file.service';
import { PrismaClient, RoleEnum } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';
import { SellerGuard } from '../src/auth/guards/seller.guard';

describe("ProductsController (E2E)", () => {
    let app: INestApplication;
    const testNewProduct = {
        name: "продукт",
        description: "продуктtesetestestest",
        tags: ["продукт"],
        price: 5,
        count: 5,
      }

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
                    id: 66,
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

    it("Проверка создания продукта", async () => {
        return request(app.getHttpServer())
        .post("/api/products/newProduct")
        .send(testNewProduct)
        .expect(201)
    })

    afterAll(async () => {
        const prisma = new PrismaClient()
    
        await prisma.product.deleteMany({
          where: {
            name: "продукт"
          }
        })
      })
})