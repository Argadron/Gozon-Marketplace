import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EditReportDto } from './dto/edit-report.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { PrismaService } from '../prisma.service';
import { ProductsService } from '../products/products.service';
import { JwtUser } from '../auth/interfaces';

@Injectable()
export class ReportsService {
    constructor(private readonly prismaService: PrismaService,
                private readonly productService: ProductsService
    ) {}

    private async findByIdOrThrow(id: number, userId: number) {
        const report = await this.prismaService.report.findUnique({ 
            where: { 
                id
            }
        })

        if (!report) throw new NotFoundException("Report not found")

        if (report.authorId !== userId) throw new ForbiddenException("This is not your report.")

        return report
    }

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
        await this.findByIdOrThrow(dto.reportId, user.id)
        
        const { reportId, ...other } = dto

        return await this.prismaService.report.update({
            where: {
                id: reportId
            },
            data: other
        })
    }

    async delete(id: number, user: JwtUser) {
        const report = await this.findByIdOrThrow(id, user.id)
        const product = await this.productService.getById(report.productId)

        await this.productService.updateInertnal(product.id, { reportsCount: product.reportsCount - 1 })

        return await this.prismaService.report.delete({
            where: {
                id
            }
        })
    }
}
