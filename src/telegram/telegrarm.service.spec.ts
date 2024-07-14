import { Test, TestingModule } from '@nestjs/testing'
import { TelegramUpdate } from './telegram.update';
import { PrismaService } from '../prisma.service';
import { TelegramService } from './telegram.service';
import { RoleEnum } from '@prisma/client';
import prismaTestClient from '../prisma-client.forTest'
import { UsersModule } from '../users/users.module';

const prisma = prismaTestClient()

describe("TelegramService", () => {
    let service: TelegramService;
    const testJwtUser = {
        id: 3,
        role: RoleEnum.ADMIN
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UsersModule],
            providers: [TelegramUpdate, PrismaService, TelegramService]
        }).compile()

        service = module.get<TelegramService>(TelegramService)
    })

    it("Проверка запроса на создание секретного ключа активации", async () => {
        expect((await service.createAuthTag(testJwtUser)).id).toBeDefined()
    })

    afterAll(async () => {
        await prisma.telegramAuth.delete({
            where: {
                userId: 3
            }
        })
    })
})