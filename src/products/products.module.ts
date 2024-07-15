import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma.service';
import { CategoriesModule } from '../categories/categories.module';
import { FileService } from '../file.service';
import { TelegramModule } from '../telegram/telegram.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CategoriesModule, TelegramModule, UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, FileService, ConfigService],
  exports: [ProductsService]
})
export class ProductsModule {}
