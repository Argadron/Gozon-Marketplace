import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

describe('ProductsService', () => {
  let service: ProductsService;
  const query = {
    page: 1,
    count: 1
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [ProductsService, PrismaService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('Проверка получения всех продуктов (страницы)', async () => {
    expect((await service.getAll(query))).toBeDefined();
  });

  it("Проверка получения продукта по ID", async () => {
    expect ((await service.getById(1))).toBeDefined()
  })
});
