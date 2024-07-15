import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma.service';
import prismaTestClient from '../prisma-client.forTest'
import { UsersModule } from '../users/users.module';

const prisma = prismaTestClient()

describe('CategoriesService', () => {
  let service: CategoriesService;
  const testNewCategory = {
    name: "категория"
  }
  let categoryId: number;

  beforeAll(async () => {
    const { id } = await prisma.category.create({ data: { name: "ультракатегория" } })

    categoryId = id
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [CategoriesService, PrismaService],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('Проверка получения всех категорий продуктов', async () => {
    expect((await service.getAll()).length).toBeDefined();
  });

  it("Проверка создания новой категории продукта", async () => {
    expect((await service.create(testNewCategory)).createdAt).toBeDefined()
  })

  it("Проверка удаления категории продукта", async () => {
    expect((await service.delete(categoryId)).name).toBeDefined()
  })

  afterAll(async () => {
    await prisma.category.delete({
      where: {
        name: "категория"
      }
    })
  })
});
