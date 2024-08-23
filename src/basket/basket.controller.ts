import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@decorators/get-user.decorator';
import { Auth } from '@decorators/auth.decorator';
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerCreated, SwaggerForbiddenException, SwaggerNoContent, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { AddProductDto } from './dto/add-product.dto';
import { ValidateOrderDto } from './dto/validate-order.dto';
import { UpdateProductCountDto } from './dto/update-product-count.dto';
import { BasketService } from './basket.service';
import { JwtUser } from '../auth/interfaces';
import { Request } from 'express';

@Controller('basket')
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
  @Auth()
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
  @Auth()
  async deleteProduct(@Param("id", ParseIntPipe) id: number, @User() user: JwtUser) {
    return await this.basketService.deleteProduct(id, user)
  }

  @Put("/updateProductCount/:id")
  @ApiOperation({ summary: "Update product count in basket" })
  @ApiResponse({ status: 200, description: "Count updated", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "Validation failed/New count gt product count", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 404, description: "Product not found in basket", type: SwaggerNotFound })
  @ApiBearerAuth()
  @Auth()
  async updateProductCount(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateProductCountDto, @User() user: JwtUser) {
    return await this.basketService.updateProductCount(id, dto, user)
  }

  @Post("/createOrder")
  @ApiOperation({ summary: "Create a order from user basket" })
  @ApiResponse({ status: 201, description: "Return checkout url and sessionId", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "User not has products on basket", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 409, description: "User already has order", type: SwaggerConflictMessage })
  @ApiBearerAuth()
  @Auth()
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
  @Auth()
  async validateOrder(@Body() dto: ValidateOrderDto, @User() user: JwtUser) {
    return await this.basketService.validateOrder(dto, user)
  }

  @Post("/copyBakset")
  @ApiOperation({ summary: "Generate copy url to basket" })
  @ApiResponse({ status: 201, description: "Url created", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Basket is empty", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  @Auth()
  async copyBasket(@User() user: JwtUser) {
    return await this.basketService.copyBasket(user)
  }

  @Get("/sharedBasket")
  @ApiOperation({ summary: "Get copied basket. Add jwt token if his exsists." })
  @ApiResponse({ status: 200, description: "Getted copied basket", type: SwaggerOK })
  @ApiResponse({ status: 404, description: "Basket from url not found", type: SwaggerNotFound })
  async getCopiedBasket(@Query("urlTag") url: string, @Req() request: Request) {
    return await this.basketService.getCopiedBasket(url, request)
  }

  @Put("/replaceBasket")
  @ApiOperation({ summary: "Replace user basket to basket from url" })
  @ApiResponse({ status: 204, description: "Bakset replaced", type: SwaggerNoContent })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 404, description: "Basket not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @Auth()
  @HttpCode(204)
  async replaceBasket(@User() user: JwtUser, @Query("urlTag") url: string) {
    return await this.basketService.replaceBasket(user, url)
  }

  @Delete("/deleteCopy")
  @ApiOperation({ summary: "Delete copied basket url" })
  @ApiResponse({ status: 204, description: "Url deleted", type: SwaggerNoContent })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "This is not your copied basket", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "Basket not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @Auth()
  @HttpCode(204)
  async deleteCopy(@User() user: JwtUser, @Query("urlTag") url: string) {
    return await this.basketService.deleteCopy(user, url)
  }
}
