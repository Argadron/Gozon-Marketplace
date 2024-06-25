import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { AlertsGateWay } from './alerts.gateway';

@Module({
  imports: [AuthModule],
  controllers: [AlertsController],
  providers: [AlertsService, PrismaService, AlertsGateWay],
  exports: [AlertsService]
})
export class AlertsModule {}
