import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SendAlertDto } from './dto/send-alert.dto';
import { JwtUser } from '../auth/interfaces';

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

    async deleteOne(id: number, user: JwtUser) {
        const alert = await this.prismaService.alert.findUnique({
            where: {
                id, 
                userId: user.id
            }
        })

        if (!alert) throw new NotFoundException("Alert not found")

        if (alert.userId !== user.id) throw new ForbiddenException("This is not your alert")

        return await this.prismaService.alert.delete({
            where: {
                id, 
                userId: user.id
            }
        })
    }
}
