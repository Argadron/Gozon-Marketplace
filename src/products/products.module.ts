import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma.service';
import { CategoriesModule } from '../categories/categories.module';
import { FileService } from '../file.service';

@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, FileService],
  exports: [ProductsService]
})
export class ProductsModule {}
