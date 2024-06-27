import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { ObjectStringToIntPipe } from '../common/pipes/object-string-to-int.pipe';
import { FileService } from '../file.service';
import { ConfigService } from '@nestjs/config';
import { StringFiltersToObject } from '../common/pipes/string-filters-to-object.pipe';
import { StringToArrayPipe } from '../common/pipes/string-to-array-pipe';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, ObjectStringToIntPipe, FileService, ConfigService, StringFiltersToObject, StringToArrayPipe],
  exports: [ObjectStringToIntPipe, StringFiltersToObject, ProductsService]
})
export class ProductsModule {}
