import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { FileService } from '../file.service';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [AlertsModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, FileService, ConfigService],
  exports: [UsersService, PrismaService, FileService, ConfigService]
})
export class UsersModule {}
