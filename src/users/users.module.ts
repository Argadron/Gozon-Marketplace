import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { FileService } from '../file.service';
import { ConfigService } from '@nestjs/config';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [forwardRef(() => AlertsModule)],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, FileService, ConfigService],
  exports: [UsersService, PrismaService, FileService, ConfigService]
})
export class UsersModule {}
