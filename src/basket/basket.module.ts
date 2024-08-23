import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { PrismaService } from '../prisma.service';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';
import { AlertsModule } from '../alerts/alerts.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProductsModule, PaymentsModule, AlertsModule, AuthModule],
  controllers: [BasketController],
  providers: [BasketService, PrismaService],
})
export class BasketModule {}
