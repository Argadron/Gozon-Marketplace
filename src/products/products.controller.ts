import { Controller, Get, Query, ValidationPipe, UsePipes, Param, ParseIntPipe, Post, UseGuards, Body, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerCreated, SwaggerForbiddenException, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { AllProductsDto } from './dto/all-products.dto';
import { ObjectStringToIntPipe } from './pipes/object-string-to-int.pipe';
import { SellerGuard } from '../auth/guards/seller.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtUser } from '../auth/interfaces';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { StringFiltersToObject } from './pipes/string-filters-to-object.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get("/all")
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({ status: 200, description: "Return all products", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiQuery({ name: "page"})
  @ApiQuery({ name: "productOnPage" })
  @ApiQuery({ name: "filters", description: "Describe all filters. All filters must be writed on array.", example: "priceMin=5+priceMax=2", required: false })
  @ApiQuery({ name: "priceMin", required: false, type: Number, description: "Min product price"})
  @ApiQuery({ name: "priceMax", required: false, type: Number, description: "Max product price"})
  @ApiQuery({ name: "category", required: false, description: "A string array of categories"})
  @ApiQuery({ name: "createdAt", required: false, type: Date, description: "CreatedAt time"})
  @ApiQuery({ name: "tags", required: false, description: "A string array of tags"})
  @ApiQuery({ name: "UpOrDown", required: false, type: Boolean, description: "Price sort asc/desc type"})
  async getAll(@Query(ObjectStringToIntPipe, StringFiltersToObject) query: AllProductsDto) {
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

  @Post("/newProduct")
  @ApiOperation({ summary: "Create new product" })
  @ApiResponse({ status: 201, description: "Product created successfly", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token invalid/Unauhorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not allowed to this action", type: SwaggerForbiddenException })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, SellerGuard)
  @UsePipes(new ValidationPipe())
  async createProduct(@Body() dto: CreateProductDto, @User() user: JwtUser, @UploadedFile() file: Express.Multer.File=undefined) {
    return await this.productsService.create(dto, user, file)
  }
}