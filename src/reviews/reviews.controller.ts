import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerCreated, SwaggerNotFound, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';

@Controller('reviews')
@UseGuards(JwtGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post("/new")
  @ApiOperation({ summary: "Create a new review" })
  @ApiResponse({ status: 201, description: "Review created", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Validation failted", type: SwaggerBadRequest }) 
  @ApiResponse({ status: 401, description: "Token invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 404, description: "Product not found", type: SwaggerNotFound })
  @ApiBearerAuth() 
  @UsePipes(new ValidationPipe())
  async newReview(@Body() dto: CreateReviewDto, @User() user: JwtUser) {
    return await this.reviewsService.newReview(dto, user)
  }
}
