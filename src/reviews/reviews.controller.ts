import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@guards/jwt.guard';
import { OptionalValidatorPipe } from '@pipes/optional-validator.pipe';
import { EmptyStringDeletorPipe } from '@pipes/empty-string-deletor.pipe';
import { ExcessPlantsValidatorPipe } from '@pipes/excess-plants-validator.pipe';
import { User } from '@decorators/get-user.decorator';
import { SwaggerBadRequest, SwaggerCreated, SwaggerForbiddenException, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { CreateReviewDto } from './dto/create-review.dto';
import { EditReviewDto } from './dto/edit-review.dto';
import { ReviewsService } from './reviews.service';
import { JwtUser } from '../auth/interfaces';

@Controller('reviews')
@UseGuards(JwtGuard)
@ApiTags("Reviews Controller")
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

  @Put("/edit")
  @ApiOperation({ summary: "Edit a review" })
  @ApiResponse({ status: 200, description: "Review edited", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "This is not your review", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "Review not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @ApiBody({
    type: EditReviewDto
  })
  @UsePipes(new EmptyStringDeletorPipe(),new OptionalValidatorPipe().check(["name", "description", "rate"]), new ValidationPipe(),
  new ExcessPlantsValidatorPipe().setType(EditReviewDto))
  async editReview(@Body() dto: EditReviewDto, @User() user: JwtUser) {
    return await this.reviewsService.edit(dto, user)
  }

  @Delete("/delete/:id")
  @ApiOperation({ summary: "Delete a review" })
  @ApiResponse({ status: 200, description: "Review deleted", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "This is not your review", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "Review not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  async deleteReview(@Param("id", ParseIntPipe) id: number, @User() user: JwtUser) {
    return await this.reviewsService.delete(id, user)
  }
}
