import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma.service';
import { ObjectStringToIntPipe } from '@pipes/object-string-to-int.pipe';
import { FileService } from '../file.service';
import { ConfigService } from '@nestjs/config';
import { StringFiltersToObject } from '@pipes/string-filters-to-object.pipe';
import { StringToArrayPipe } from '@pipes/string-to-array-pipe';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, ObjectStringToIntPipe, FileService, ConfigService, StringFiltersToObject, StringToArrayPipe],
  exports: [ObjectStringToIntPipe, StringFiltersToObject, ProductsService]
})
export class ProductsModule {}
