import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma.service';
import prismaTestClient from '../prisma-client.forTest'
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RoleEnum } from '@prisma/client';
import { AdminGuard } from '../auth/guards/admin.guard';

const prisma = prismaTestClient()

describe('CategoriesController', () => {
  let controller: CategoriesController;
  const testNewCategory = {
    name: "категория1"
  }
  let categoryId: number;

  beforeAll(async () => {
    const { id } = await prisma.category.create({ data: { name: "ультракатегория" } })

    categoryId = id
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService, PrismaService],
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
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('Проверка запроса на получение всех категорий продуктов', async () => {
    expect((await controller.all()).length).toBeDefined();
  });

  it("Проверка запроса на создание новой категории продуктов", async () => {
    expect((await controller.create(testNewCategory)).createdAt).toBeDefined()
  })

  it("Проверка запроса на удаление категории продукта", async () => {
    expect((await controller.delete(categoryId)).name).toBeDefined()
  })

  afterAll(async () => {
    await prisma.category.delete({
      where: {
        name: "категория1"
      }
    })
  })
});
