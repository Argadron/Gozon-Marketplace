import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { prisma } from '../prisma-client.forTest';
import { AuthModule } from '../auth/auth.module';
import { AlertsModule } from './alerts.module';
import { PrismaService } from '../prisma.service';
import { RoleEnum } from '@prisma/client';

describe('AlertsService', () => {
  let service: AlertsService;
  const testAlert = {
    username: "ArgadronSeller!",
    description: "тебе уведомление!"
  }
  const testJwtUser = {
    id: 3,
    role: RoleEnum.ADMIN
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, AlertsModule],
      providers: [AlertsService, PrismaService],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
  });

  it('Проверка создания уведомления', async () => {
    expect((await service.send(testAlert)).userId).toBeDefined();
  });

  it("Проверка удаления уведомления", async () => {
    expect((await service.deleteOne(5, testJwtUser)).description).toBeDefined()
  })
});
