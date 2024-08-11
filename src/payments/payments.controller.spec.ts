import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma.service'
import { JwtGuard } from '@guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { Request } from 'express';
import prismaTestClient from '../prisma-client.forTest'
import { RolesGuard } from '@guards/roles.guard';

const prisma = prismaTestClient()

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let paymentId: number;

  beforeAll(async () => {
    const { id } = await prisma.payments.create({ data: { payUserId: 64, amount: 500 } })

    paymentId = id
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [PaymentsService, PrismaService],
    }).overrideGuard(JwtGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest()

        request.user = {
          id: 3,
          role: RoleEnum.ADMIN
        }

        return true
      }
    }).overrideGuard(RolesGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest()

        request.user = {
          id: 3,
          role: RoleEnum.ADMIN
        }

        return true
      }
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('Проверка получения всех ожиданий переводов', async () => {
    expect((await controller.getAll())).toBeDefined();
  });

  it("Проверка удаления ожидания перевода по ID", async () => {
    expect((await controller.delete(paymentId)).createdAt).toBeDefined()
  })
});
