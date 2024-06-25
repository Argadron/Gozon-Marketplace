import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AuthModule } from '../auth/auth.module';
import { prisma } from '../prisma-client.forTest';

describe('AlertsController', () => {
  let controller: AlertsController;
  const testAlert = {
    username: "ArgadronSeller",
    description: "тебе уведомление!"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [AlertsController],
      providers: [AlertsService],
    }).compile();

    controller = module.get<AlertsController>(AlertsController);
  });

  it('Проверка запроса на создание уведомления', async () => {
    expect((await controller.send(testAlert)).userId).toBeDefined();
  });
});
