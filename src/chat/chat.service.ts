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
            },
            include: {
                messages: true
            }
        })
    }

    async findMessage(messageId: number) {
        return await this.prismaService.message.findUnique({ where: { id: messageId } })
    }

    async createChat(sellerId: number, userId: number) {
        return await this.prismaService.chat.create({
            data: {
                sellerId,
                userId
            }
        })
    }

    async deleteChat(chatId: number) {  
        await this.prismaService.message.deleteMany({ where: { chatId } })

        return await this.prismaService.chat.delete({
            where: {
                id: chatId
            },
            include: {
                messages: true
            }
        })
    }

    async sendMessage(message: string, userId: number, chatId: number) {
        return await this.prismaService.message.create({
            data: {
                chatId,
                userId,
                text: message
            }
        })
    }

    async editMessage(message: string, messageId: number) {
        return await this.prismaService.message.update({
            where: {
                id: messageId
            },
            data: {
                text: message
            }
        })
    }

    async deleteMessage(messageId: number) {
        return await this.prismaService.message.delete({
            where: {
                id: messageId
            }
        })
    }
}
