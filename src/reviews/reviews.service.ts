import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtUser } from '../auth/interfaces';
import { EditReviewDto } from './dto/edit-review.dto';

@Injectable()
export class ReviewsService {
    constructor(private readonly prismaService: PrismaService) {}

    private async getProductOrThrow(id: number) {
        const product = await this.prismaService.product.findUnique({ where: { id }, include: { reviews: true } })

        if (!product) throw new NotFoundException("Product not found")

        return product
    }

    private async getReviewOrThrow(id: number) {
        const review = await this.prismaService.review.findUnique({
            where: {
                id
            }
        })

        if (!review) throw new NotFoundException("Review not found")

        return review
    }

    async newReview(dto: CreateReviewDto, user: JwtUser) {
        const product = await this.getProductOrThrow(dto.productId)

        let newRate = product.rate + dto.rate;
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

    async edit(dto: EditReviewDto, user: JwtUser) {
        const product = await this.getProductOrThrow(dto.productId)
        const review = await this.getReviewOrThrow(dto.reviewId)

        if (review.authorId !== user.id) throw new ForbiddenException("This is not your review")

        let newRate = product.rate;

        if (dto.rate > 0) {
            newRate += dto.rate 
            newRate = newRate / (product.reviews.length + 1)
        }

        await this.prismaService.product.update({
            where: {
                id: dto.productId
            },
            data: {
                rate: newRate
            }
        })

        delete dto.productId
        delete dto.reviewId

        return await this.prismaService.review.update({
            where: {
                id: review.id,
                authorId: user.id
            },
            data: dto
        })
    }
}
