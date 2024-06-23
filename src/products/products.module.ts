import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { ObjectStringToIntPipe } from './pipes/object-string-to-int.pipe';
import { FileService } from '../file.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, ObjectStringToIntPipe, FileService, ConfigService],
  exports: [ObjectStringToIntPipe]
})
export class ProductsModule {}
