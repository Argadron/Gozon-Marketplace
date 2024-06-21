import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service'
import { JwtModule } from '@nestjs/jwt';
import config from '../config/constants'
import { ConfigService } from '@nestjs/config';
import { FileService } from '../file.service'

const constants = config()

@Module({
  imports: [JwtModule.register({
      global: true,
      secret: constants.JWT_SECRET
  })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, ConfigService, FileService]
})
export class AuthModule {}
