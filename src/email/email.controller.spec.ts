import { Test, TestingModule } from '@nestjs/testing'
import { EmailController } from './email.controller'
import { ExecutionContext } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from '@guards/jwt.guard';
import { Request } from 'express'
import { RoleEnum } from '@prisma/client';

describe("EmailController", () => {
    let controller: EmailController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [EmailController],
          providers: [EmailService, ConfigService],
        }).overrideGuard(JwtGuard).useValue({
          canActivate: (ctx: ExecutionContext) => {
            const request: Request = ctx.switchToHttp().getRequest()
    
            request.user = {
              id: 3,
              role: RoleEnum.ADMIN
            }
    
            return true
          }
        }).compile();
    
        controller = module.get<EmailController>(EmailController);
      });

    
})