import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { PrismaService } from '../prisma.service';
import { AlertsGateWay } from './alerts.gateway';
import { JwtService } from '@nestjs/jwt'

@Module({
  controllers: [AlertsController],
  providers: [AlertsService, PrismaService, AlertsGateWay, JwtService],
  exports: [AlertsService, JwtService]
})
export class AlertsModule {}
