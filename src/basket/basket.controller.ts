import { Body, Controller, Delete, HttpCode, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@guards/jwt.guard';
import { User } from '@decorators/get-user.decorator';
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerCreated, SwaggerForbiddenException, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { AddProductDto } from './dto/add-product.dto';
import { ValidateOrderDto } from './dto/validate-order.dto';
import { BasketService } from './basket.service';
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

  @Post("/createOrder")
  @ApiOperation({ summary: "Create a order from user basket" })
  @ApiResponse({ status: 201, description: "Return checkout url and sessionId", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "User not has products on basket", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 409, description: "User alreadhy has order", type: SwaggerConflictMessage })
  @ApiBearerAuth()
  async createOrder(@User() user: JwtUser) {
    return await this.basketService.createOrder(user)
  }

  @Post("/validateOrder")
  @ApiOperation({ summary: "Validation order and create payment request to sellers" })
  @ApiResponse({ status: 201, description: "Payment request created", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "This is not your order", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "Order/Session not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async validateOrder(@Body() dto: ValidateOrderDto, @User() user: JwtUser) {
    return await this.basketService.validateOrder(dto, user)
  }
}
