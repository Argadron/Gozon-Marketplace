import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [BasketController],
  providers: [BasketService, PrismaService],
})
export class BasketModule {}
