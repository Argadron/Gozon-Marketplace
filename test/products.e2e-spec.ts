import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ProductsModule } from '../src/products/products.module';
import { PrismaService } from '../src/prisma.service';
import * as request from 'supertest'

describe("ProductsController (E2E)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ProductsModule],
            providers: [PrismaService]
        }).compile()

        app = moduleFixture.createNestApplication()
        app.setGlobalPrefix("/api")

        await app.init()
    })

    it("Проверка получения всех продуктов (страницы)", async () => {
        return request(app.getHttpServer())
        .get("/api/products/all?page=1&count=1")
        .expect(200)
    })

    it("Проверка получения продукта по ID", async () => {
        return request(app.getHttpServer())
        .get("/api/products/1")
        .expect(404)
    })
})