import { Module } from '@nestjs/common';
import { SellerRequirementsService } from './seller-requirements.service';
import { SellerRequirementsController } from './seller-requirements.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [SellerRequirementsController],
  providers: [SellerRequirementsService, PrismaService],
})
export class SellerRequirementsModule {}
