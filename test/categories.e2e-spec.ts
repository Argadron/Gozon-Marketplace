import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesModule } from '../src/categories/categories.module';
import { PrismaService } from '../src/prisma.service';
import * as request from 'supertest'
import { AdminGuard } from '../src/auth/guards/admin.guard';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';
import { RoleEnum } from '@prisma/client';
import prismaTestClient from '../src/prisma-client.forTest'

const prisma = prismaTestClient()

describe("CategoriesController (E2E)", () => {
    let app: INestApplication;
    const testNewCategory = {
        name: "категория"
    }
    let categoryId: number;

  beforeAll(async () => {
    const { id } = await prisma.category.create({ data: { name: "ультракатегория" } })

    categoryId = id
  })

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [CategoriesModule],
            providers: [PrismaService]
        }).overrideGuard(JwtGuard).useValue({
            canActivate: (ctx: ExecutionContext) => {
              const request: Request = ctx.switchToHttp().getRequest()
      
              request.user = {
                id: 3,
                role: RoleEnum.ADMIN
              }
      
              return true
            }
          }).overrideGuard(AdminGuard).useValue({
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

    it("Проверка запроса на получение всех категорий продуктов", async () => {
        return request(app.getHttpServer())
        .get("/api/categories/all")
        .expect(200)
    })

    it("Проверка запроса на создание новой категории продуктов", async () => {
        return request(app.getHttpServer())
        .post("/api/categories/new")
        .send(testNewCategory)
        .expect(201)
    })

    it("Проверка запроса на удаление категории продукта", async () => {
      return request(app.getHttpServer())
      .delete(`/api/categories/delete/${categoryId}`)
      .expect(200)
    })

    afterAll(async () => {
        await prisma.category.delete({
            where: {
                name: "категория"
            }
        })
    })
})