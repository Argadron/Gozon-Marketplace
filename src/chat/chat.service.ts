import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
    constructor(private readonly prismaService: PrismaService) {}

    async findChat(sellerId: number=undefined, userId: number=undefined) {
        const type = sellerId || userId 

        if (!type) throw new BadRequestException("Missing one of two find way")

        return await this.prismaService.chat.findFirst({
            where: {
                OR: [
                    { sellerId },
                    { userId }
                ]
            }
        })
    }
}
