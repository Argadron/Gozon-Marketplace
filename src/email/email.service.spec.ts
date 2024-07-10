import { Test, TestingModule } from '@nestjs/testing'
import { EmailService } from './email.service'
import { ConfigService } from '@nestjs/config';
import prismaTestClient from '../prisma-client.forTest'
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';
import { RoleEnum } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AlertsModule } from '../alerts/alerts.module';
import { v4 } from 'uuid'

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
          imports: [UsersModule, AlertsModule],
          providers: [EmailService, ConfigService, PrismaService, JwtService],
        }).compile();
    
        service = module.get<EmailService>(EmailService);
      });

    it("Проверка отправки письма на почту", async () => {
        expect((await service.createVerification(testJwtUser)).urlTag).toBeDefined()
    })

    it("Проверка валидации тега", async () => {
        expect((await service.validateTag(tag))).toBeUndefined()
    })

    afterAll(async () => {
        await prisma.emailConfirms.delete({
            where: {
                id: 64
            }
        })
    })
})