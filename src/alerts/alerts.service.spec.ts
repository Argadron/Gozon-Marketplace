import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { prisma } from '../prisma-client.forTest';
import { AuthModule } from '../auth/auth.module';
import { AlertsModule } from './alerts.module';

describe('AlertsService', () => {
  let service: AlertsService;
  const testAlert = {
    username: "ArgadronSeller",
    description: "тебе уведомление!"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, AlertsModule],
      providers: [AlertsService],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
  });

  it('Проверка создания уведомления', async () => {
    expect((await service)).toBeDefined();
  });
});
