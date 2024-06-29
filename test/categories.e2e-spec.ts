import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesModule } from '../src/categories/categories.module';
import { PrismaService } from '../src/prisma.service';
import * as request from 'supertest'

describe("CategoriesController (E2E)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [CategoriesModule],
            providers: [PrismaService]
        }).compile()

        app = moduleFixture.createNestApplication()
        app.setGlobalPrefix("/api")

        await app.init()
    })

    it("Проверка запроса на получение всех категорий продуктов", async () => {
        return request(app.getHttpServer())
        .get("/api/categories/all")
        .expect(200)
    })
})