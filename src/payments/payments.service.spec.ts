import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma.service'
import prismaTestClient from '../prisma-client.forTest'

const prisma = prismaTestClient()

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentId: number;

  beforeAll(async () => {
    const { id } = await prisma.payments.create({ data: { payUserId: 64, amount: 500 } })

    paymentId = id
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService, PrismaService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('Проверка получения всех ожиданий переводов', async () => {
    expect((await service.getAll())).toBeDefined();
  });

  it("Проверка удаления ожидания перевода по ID", async () => {
    expect((await service.delete(paymentId)).createdAt).toBeDefined()
  })
});
