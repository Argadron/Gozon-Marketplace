import { Module } from '@nestjs/common';
import { SellerRequirementsService } from './seller-requirements.service';
import { SellerRequirementsController } from './seller-requirements.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [SellerRequirementsController],
  providers: [SellerRequirementsService, PrismaService],
  exports: [SellerRequirementsService]
})
export class SellerRequirementsModule {}
