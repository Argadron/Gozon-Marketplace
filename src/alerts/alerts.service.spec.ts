import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import prismaTestClient from '../prisma-client.forTest'
import { AlertsModule } from './alerts.module';
import { PrismaService } from '../prisma.service';
import { RoleEnum } from '@prisma/client';

const prisma = prismaTestClient()

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
  let alertId: number;

  beforeAll(async () => {
    const { id } = await prisma.alert.create({ data: { userId: 3, description: "тебе уведомление!" } })

    alertId = id
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertsService, PrismaService],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
  });

  it('Проверка создания уведомления', async () => {
    expect((await service.send(testAlert)).userId).toBeDefined();
  });

  it("Проверка удаления уведомления", async () => {
    expect((await service.deleteOne(alertId, testJwtUser))).toBeDefined()
  })

  it("Проверка удаления ВСЕХ уведомлений", async () => {
    expect((await service.deleteAll(testJwtUser)).count).toBeDefined()
  })
});
