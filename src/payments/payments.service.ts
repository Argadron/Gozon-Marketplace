import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePayment } from './interfaces';

@Injectable()
export class PaymentsService {
    constructor (private readonly prismaService: PrismaService) {}

    async getAll() {
        return await this.prismaService.payments.findMany()
    }

    async delete(id: number) {
        if (!await this.prismaService.payments.findUnique({ where: { id } })) throw new NotFoundException("Payment not found")

        return await this.prismaService.payments.delete({
            where: {
                id
            }
        })
    }

    async create(data: CreatePayment) {
        return await this.prismaService.payments.create({
            data
        })
    }
}
