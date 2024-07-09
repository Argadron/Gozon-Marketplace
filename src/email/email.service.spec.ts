import { Test, TestingModule } from '@nestjs/testing'
import { EmailService } from './email.service'
import { ConfigService } from '@nestjs/config';

describe("EmailService", () => {
    let service: EmailService;
    const testEmail = {
        to: process.env.MAIL_USER,
        text: "Проверка отправки почты",
        subject: "EmailService Test",
        templateObject: {
            action: "test",
            url: "https://google.com",
            name: "Геннадий"
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [EmailService, ConfigService],
        }).compile();
    
        service = module.get<EmailService>(EmailService);
      });

    it("Проверка отправки письма на почту", async () => {
        expect((await service.sendEmail(testEmail))).toBeDefined()
    })
})