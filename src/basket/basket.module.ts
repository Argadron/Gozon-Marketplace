import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { PrismaService } from '../prisma.service';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [ProductsModule, PaymentsModule],
  controllers: [BasketController],
  providers: [BasketService, PrismaService],
})
export class BasketModule {}
