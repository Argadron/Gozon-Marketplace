import { Test, TestingModule } from '@nestjs/testing'
import { EmailService } from './email.service'
import { ConfigService } from '@nestjs/config';
import prismaTestClient from '../prisma-client.forTest'
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';
import { RoleEnum } from '@prisma/client';
import { v4 } from 'uuid'
import { Telegraf, Context } from 'telegraf'

const prisma = prismaTestClient()

describe("EmailService", () => {
    let service: EmailService;
    let tag: string;
    const testJwtUser = {
        id: 64,
        role: RoleEnum.SELLER
    }
    
    beforeAll(async () => {
        const { urlTag } = await prisma.emailConfirms.create({
            data: { userId: 3, urlTag: v4() }
          })

        tag = urlTag
    })

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [UsersModule],
          providers: [EmailService, ConfigService, PrismaService, Telegraf<Context>],
        }).compile();
    
        service = module.get<EmailService>(EmailService);
      });

    it("Проверка отправки письма на почту", async () => {
        expect((await service.createVerification(testJwtUser)).urlTag).toBeDefined()
    })

    it("Проверка валидации тега", async () => {
        expect((await service.validateTag(tag))).toBeUndefined()
    })

    it("Проверка отправки письма для включени/выключения двухфакторной аутентификации", async () => {
        expect((await service.twoFactorAuth(testJwtUser)).length).toBeDefined()
    })

    afterAll(async () => {
        await prisma.emailConfirms.delete({
            where: {
                userId: 64
            }
        })
    })
})