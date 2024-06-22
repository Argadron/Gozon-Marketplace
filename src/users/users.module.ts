import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { FileService } from '../file.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, FileService, ConfigService],
  exports: [UsersService, PrismaService, FileService, ConfigService]
})
export class UsersModule {}
