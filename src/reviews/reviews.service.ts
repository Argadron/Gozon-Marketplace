import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtUser } from '../auth/interfaces';

@Injectable()
export class ReviewsService {
    constructor(private readonly prismaService: PrismaService) {}

    async newReview(dto: CreateReviewDto, user: JwtUser) {
        const product = await this.prismaService.product.findUnique({ where: { id: dto.productId }, include: { reviews: true } })

        if (!product) throw new NotFoundException("Product not found")

        let newRate = product.rate;

        newRate += dto.rate
        newRate = newRate / (product.reviews.length + 1)

        await this.prismaService.product.update({
            where: {
                id: dto.productId
            },
            data: {
                rate: newRate
            }
        })

        return await this.prismaService.review.create({
            data: {
                authorId: user.id, 
                ...dto
            }
        })
    }
}
