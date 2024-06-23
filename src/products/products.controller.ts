import { Controller, Get, Query, ValidationPipe, UsePipes, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerNotFound, SwaggerOK } from '../swagger/apiResponse.interfaces';
import { AllProductsDto } from './dto/all-products.dto';
import { ObjectStringToIntPipe } from './pipes/object-string-to-int.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get("/all")
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({ status: 200, description: "Return all products", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiQuery({ name: "page"})
  @ApiQuery({ name: "count" })
  async getAll(@Query(ObjectStringToIntPipe) query: AllProductsDto) {
    return await this.productsService.getAll(query)
  }

  @Get(`/:id`)
  @ApiOperation({ summary: "Get product by id" })
  @ApiResponse({ status: 200, description: "Return one product info", type: SwaggerOK })
  @ApiResponse({ status: 404, description: "Product not found", type: SwaggerNotFound })
  @ApiResponse({ status: 400, description: "Id of product not writed", type: SwaggerBadRequest })
  async getById(@Param("id", ParseIntPipe) id: number) {
    return await this.productsService.getById(id)
  }
}
