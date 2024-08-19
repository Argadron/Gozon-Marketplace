import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import config from '@config/constants'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SellerRequirementsModule } from './seller-requirements/seller-requirements.module';
import { AlertsModule } from './alerts/alerts.module';
import { BasketModule } from './basket/basket.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReportsModule } from './reports/reports.module';
import { CategoriesModule } from './categories/categories.module';
import { ChatModule } from './chat/chat.module';
import { EmailModule } from './email/email.module';
import { StripeModule } from './stripe/stripe.module';
import { PaymentsModule } from './payments/payments.module';
import { TelegramModule } from './telegram/telegram.module';

const constants = config()

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true
  }), UsersModule, ProductsModule, SellerRequirementsModule, AlertsModule, BasketModule, ReviewsModule,
  ReportsModule, CategoriesModule, ChatModule, EmailModule, StripeModule.forRoot(constants.STRIPE_API_KEY, { apiVersion: "2024-06-20" }), 
  PaymentsModule, TelegramModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
