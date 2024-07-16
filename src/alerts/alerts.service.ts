import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SendAlertDto } from './dto/send-alert.dto';
import { JwtUser } from '../auth/interfaces';

@Injectable()
export class AlertsService {
    constructor(private readonly prismaService: PrismaService
    ) {}

    private async addIdToGlobalRead(userId: number, alertId: number=null) {
        const where = { userId, id: alertId ? alertId : null }

        alertId ? null : delete where.id

        return await this.prismaService.alert.updateMany({
            where: {
                OR: [ { id: where.id, userId }, { id: where.id } ],
                NOT: {
                    deletedIds: {
                        has: userId
                    }
                }
            },
            data: {
                deletedIds: {
                    push: userId
                }
            }
        })
    }

    async getMany(found: any) {
        return await this.prismaService.alert.findMany({ where: found })
    }

    async send(dto: SendAlertDto) {
        if (dto.isGlobal) {
            return await this.prismaService.alert.create({
                data: {
                    description: dto.description,
                    isGlobal: true
                }
            })
        }
        else {
            // Circular dependencie with usersModule. Use prisma.
            const User = await this.prismaService.user.findUnique({
                where: { 
                    username: dto.username 
                }
            })

            return await this.prismaService.alert.create({
                data: {
                    userId: User.id, 
                    description: dto.description
                }
            })
        }
    }

    async sendInternal(userId: number, message: string) {
        return await this.prismaService.alert.create({
            data: {
                userId,
                description: message
            }
        })
    }

    async deleteOne(id: number, user: JwtUser) {
        const alert = await this.prismaService.alert.findUnique({
            where: {
                id
            }
        })

        if (!alert) throw new NotFoundException("Alert not found")

        if (!alert.isGlobal) {
            if (alert.userId !== user.id) throw new ForbiddenException("This is not your alert")

            return await this.prismaService.alert.delete({
                where: {
                    id, 
                    userId: user.id
                }
            })
        }
        else {
            return await this.addIdToGlobalRead(user.id, id)
        }
    }

    async deleteAll(user: JwtUser) {
        await this.addIdToGlobalRead(user.id)

        return await this.prismaService.alert.deleteMany({
            where: {
                userId: user.id
            }
        })
    }
}
