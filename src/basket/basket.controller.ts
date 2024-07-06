import { Body, Controller, Delete, HttpCode, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BasketService } from './basket.service';
import { JwtGuard } from '@guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerForbiddenException, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { AddProductDto } from './dto/add-product.dto';
import { User } from '@decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';

@Controller('basket')
@UseGuards(JwtGuard)
@ApiTags("Basket Controller")
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post("/addProduct")
  @ApiOperation({ summary: "Add a new product to the basket" })
  @ApiResponse({ status: 200, description: "Product successfly added to basket", type: SwaggerOK})
  @ApiResponse({ status: 400, description: "Validation failed / Product count less than user count", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 404, description: "Product not found", type: SwaggerNotFound })
  @ApiResponse({ status: 409, description: "Product alreahy exsists on your basket", type: SwaggerConflictMessage })
  @ApiBearerAuth()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async addProduct(@Body() dto: AddProductDto, @User() user: JwtUser) {
    return await this.basketService.addProduct(dto, user)
  }

  @Delete("/deleteProduct/:id")
  @ApiOperation({ summary: "Delete a one product from basket" })
  @ApiResponse({ status: 200, description: "Product deleted from basket", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "This is not your product", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "Product not found on basket", type: SwaggerNotFound })
  @ApiBearerAuth()
  async deleteProduct(@Param("id", ParseIntPipe) id: number, @User() user: JwtUser) {
    return await this.basketService.deleteProduct(id, user)
  }
}
