import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtUser } from '../auth/interfaces';
import { EditReviewDto } from './dto/edit-review.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
    constructor(private readonly prismaService: PrismaService,
                private readonly productService: ProductsService
    ) {}

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
        const product = await this.productService.getById(dto.productId)

        let newRate = dto.rate;
        product.reviews.forEach((elem) => newRate += elem.rate)
        newRate = +(newRate / (product.reviews.length + 1)).toFixed(1)

        await this.productService.updateInertnal(product.id, { rate: newRate })

        return await this.prismaService.review.create({
            data: {
                authorId: user.id, 
                ...dto
            }
        })
    }

    async edit(dto: Partial<EditReviewDto>, user: JwtUser) {
        const product = await this.productService.getById(dto.productId)
        const review = await this.getReviewOrThrow(dto.reviewId)

        if (dto.rate <= 0 || dto.rate > 5) throw new BadRequestException("Rate must be great of 0 and less of 5")

        if (review.authorId !== user.id) throw new ForbiddenException("This is not your review")

        let newRate = dto.rate;

        if (dto.rate > 0) {
            product.reviews.forEach((elem) => newRate += elem.rate)
            newRate = +(newRate / (product.reviews.length + 1)).toFixed(1)
        }

        await this.productService.updateInertnal(product.id, { rate: newRate })

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

    async delete(id: number, user: JwtUser) {
        const review = await this.getReviewOrThrow(id)

        if (review.authorId !== user.id) throw new ForbiddenException("This is not your review")

        const product = await this.productService.getById(review.productId)

        let newRate = 0;
        product.reviews.forEach((elem) => newRate += elem.rate)
        newRate -= review.rate
        newRate = +(newRate / (product.reviews.length - 1)).toFixed(1)

        await this.productService.updateInertnal(product.id, { rate: newRate })

        return await this.prismaService.review.delete({
            where: {
                id
            }
        })
    }
}
