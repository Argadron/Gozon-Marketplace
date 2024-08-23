import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/jwt.strategy';
import config from '../config/constants'
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service'
import { FileService } from '../file.service'
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { TelegramModule } from '../telegram/telegram.module';

const constants = config()

@Module({
  imports: [JwtModule.register({
      global: true,
      secret: constants.JWT_SECRET
  }), UsersModule, EmailModule, TelegramModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, ConfigService, FileService, LocalStrategy],
  exports: [LocalStrategy, AuthService]
})
export class AuthModule {}
