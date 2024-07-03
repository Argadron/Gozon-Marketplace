import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AlertsService } from '../alerts/alerts.service';

@Module({
  imports: [UsersModule],
  providers: [ChatGateway, ChatService, PrismaService, UsersService, AlertsService],
})
export class ChatModule {}
