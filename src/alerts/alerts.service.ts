import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SendAlertDto } from './dto/send-alert.dto';

@Injectable()
export class AlertsService {
    constructor(private readonly prismaService: PrismaService) {}

    async send(dto: SendAlertDto) {
        const User = await this.prismaService.user.findUnique({
            where: {
                username: dto.username
            }
        })

        if (!User) throw new NotFoundException("User not found")

        return await this.prismaService.alert.create({
            data: {
                userId: User.id, 
                description: dto.description
            }
        })
    }
}
