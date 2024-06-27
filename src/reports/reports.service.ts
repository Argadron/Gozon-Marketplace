import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtUser } from '../auth/interfaces';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReportsService {
    constructor(private readonly prismaService: PrismaService,
                private readonly productService: ProductsService
    ) {}

    async create(dto: CreateReportDto, user: JwtUser) {
        const product = await this.productService.getById(dto.productId)

        await this.prismaService.product.update({
            where: {
                id: product.id
            },
            data: {
                reportsCount: product.reportsCount + 1
            }
        })

        return await this.prismaService.report.create({
            data: {
                authorId: user.id,
                ...dto
            }
        })
    }
}
