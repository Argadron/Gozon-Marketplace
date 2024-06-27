import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtUser } from '../auth/interfaces';
import { ProductsService } from '../products/products.service';
import { EditReportDto } from './dto/edit-report.dto';

@Injectable()
export class ReportsService {
    constructor(private readonly prismaService: PrismaService,
                private readonly productService: ProductsService
    ) {}

    async create(dto: CreateReportDto, user: JwtUser) {
        const product = await this.productService.getById(dto.productId)

        await this.productService.updateInertnal(product.id, { reportsCount: product.reportsCount + 1 })

        return await this.prismaService.report.create({
            data: {
                authorId: user.id,
                ...dto
            }
        })
    }

    async edit(dto: Partial<EditReportDto>, user: JwtUser) {
        const report = await this.prismaService.report.findUnique({ 
            where: { 
                id: dto.reportId
            }
        })

        if (!report) throw new NotFoundException("Report not found")

        if (report.authorId !== user.id) throw new ForbiddenException("This is not your report.")

        const { reportId, ...other } = dto

        return await this.prismaService.report.update({
            where: {
                id: reportId
            },
            data: other
        })
    }
}
