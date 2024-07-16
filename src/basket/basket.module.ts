import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { PrismaService } from '../prisma.service';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [ProductsModule, PaymentsModule, AlertsModule],
  controllers: [BasketController],
  providers: [BasketService, PrismaService],
})
export class BasketModule {}
