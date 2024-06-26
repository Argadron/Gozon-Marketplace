import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SellerRequirementsModule } from './seller-requirements/seller-requirements.module';
import { AlertsModule } from './alerts/alerts.module';
import { BasketModule } from './basket/basket.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true
  }), UsersModule, ProductsModule, SellerRequirementsModule, AlertsModule, BasketModule, ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
