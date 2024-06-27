import { Test, TestingModule } from '@nestjs/testing';
import { BasketService } from './basket.service';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import { FileService } from '../file.service';

describe('BasketService', () => {
  let service: BasketService;
  const testAddProduct = {
    productId: 26,
    productCount: 1
  }
  const testJwtUser = {
    id: 32,
    role: RoleEnum.ADMIN
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
      providers: [BasketService, PrismaService, ProductsService, FileService],
    }).compile();

    service = module.get<BasketService>(BasketService);
  });

  it('Проверка добавления товара в корзину', async () => {
    expect((await service.addProduct(testAddProduct, testJwtUser))).toBeDefined();
  });

  it("Проверка удаления товара из корзины", async () => {
    expect((await service.deleteProduct(5, testJwtUser)).count).toBeDefined()
  })
});
