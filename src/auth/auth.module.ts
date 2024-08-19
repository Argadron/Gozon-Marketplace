import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service'
import { FileService } from '../file.service'
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [UsersModule, EmailModule, TelegramModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, ConfigService, FileService, LocalStrategy],
  exports: [LocalStrategy]
})
export class AuthModule {}
