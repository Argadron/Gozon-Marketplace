import { Controller, Get, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerOK } from '../swagger/apiResponse.interfaces';
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
  async getAll(@Query(ObjectStringToIntPipe) query: AllProductsDto) {
    return await this.productsService.getAll(query)
  }
}
