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
import { ReportsModule } from './reports/reports.module';
import { CategoriesModule } from './categories/categories.module';
import { ChatModule } from './chat/chat.module';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { StripeModule } from './stripe/stripe.module';
import { PaymentsModule } from './payments/payments.module';
import config from '@config/constants'
import { TelegramModule } from './telegram/telegram.module';

const constants = config()

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true
  }), UsersModule, ProductsModule, SellerRequirementsModule, AlertsModule, BasketModule, ReviewsModule,
  ReportsModule, CategoriesModule, ChatModule, EmailModule, StripeModule.forRoot(constants.STRIPE_API_KEY, { apiVersion: "2024-06-20" }), 
  PaymentsModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
