import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service'
import { JwtModule } from '@nestjs/jwt';
import config from '../config/constants'
import { ConfigService } from '@nestjs/config';
import { FileService } from '../file.service'
import { JwtGuard } from './guards/jwt.guard';
import { LocalStrategy } from './strategies/jwt.strategy';
import { SellerGuard } from './guards/seller.guard';
import { AdminGuard } from './guards/admin.guard';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';

const constants = config()

@Module({
  imports: [JwtModule.register({
      global: true,
      secret: constants.JWT_SECRET
  }), UsersModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, ConfigService, FileService, JwtGuard, LocalStrategy, AdminGuard, SellerGuard],
  exports: [JwtGuard, LocalStrategy, AdminGuard, SellerGuard]
})
export class AuthModule {}
