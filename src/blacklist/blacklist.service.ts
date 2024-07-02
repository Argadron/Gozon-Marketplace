import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtUser } from '../auth/interfaces';

@Injectable()
export class BlacklistService {
    constructor(private readonly prismaService: PrismaService) {}

    async all(user: JwtUser) {
        return await this.prismaService.blackList.findUnique({
            where: {
                userId: user.id
            },
            select: {
                blockedIds: true
            }
        })
    }
}
