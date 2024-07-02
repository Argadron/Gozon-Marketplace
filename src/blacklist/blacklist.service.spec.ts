import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistService } from './blacklist.service';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../prisma.service';

describe('BlacklistService', () => {
  let service: BlacklistService;
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlacklistService, PrismaService],
    }).compile();

    service = module.get<BlacklistService>(BlacklistService);
  });

  it('Проверка получения всего blacklist', async () => {
    expect(((await service.all(testJwtUser)))).toBe(null);
  });
});
