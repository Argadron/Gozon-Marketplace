import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, PrismaService],
})
export class ReviewsModule {}
