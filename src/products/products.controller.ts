import { Controller, Get, Query, ValidationPipe, UsePipes, Param, ParseIntPipe, Post, UseGuards, Body, UploadedFile, Put, Res, Delete, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerCreated, SwaggerForbiddenException, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { AllProductsDto } from './dto/all-products.dto';
import { ObjectStringToIntPipe } from '../common/pipes/object-string-to-int.pipe';
import { SellerGuard } from '../auth/guards/seller.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtUser } from '../auth/interfaces';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { StringFiltersToObject } from '../common/pipes/string-filters-to-object.pipe';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { StringToArrayPipe } from '../common/pipes/string-to-array-pipe';
import { OptionalValidatorPipe } from '../common/pipes/optional-validator.pipe';
import { EmptyStringDeletorPipe } from '../common/pipes/empty-string-deletor.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService,
              private readonly stringToArrayPipe: StringToArrayPipe
  ) {}

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

  @Get(`/photo/:id`)
  @ApiOperation({ summary: "Get product photo by id" })
  @ApiResponse({ status: 200, description: "Return a product photo", type: SwaggerOK })
  @ApiResponse({ status: 404, description: "Product/photo not found", type: SwaggerNotFound })
  async getPhotoById(@Param("id", ParseIntPipe) id: number, @Res() res: Response) {
    return await this.productsService.getPhotoById(id, res)
  }

  @Post("/newProduct")
  @ApiOperation({ summary: "Create new product" })
  @ApiResponse({ status: 201, description: "Product created successfly", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token invalid/Unauhorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not allowed to this action", type: SwaggerForbiddenException })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, SellerGuard)
  @UsePipes(ObjectStringToIntPipe,new StringToArrayPipe().Include(["tags", "productCategories"]), new ValidationPipe())
  @UseInterceptors(FileInterceptor("file"))
  async createProduct(@Body() dto: CreateProductDto, @User() user: JwtUser, @UploadedFile() file: Express.Multer.File=undefined) {
    return await this.productsService.create(dto, user, file)
  }

  @Put("/updateProduct")
  @ApiOperation({ summary: "Update a product" })
  @ApiResponse({ status: 200, description: "Product updated", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, SellerGuard)
  @UsePipes(ObjectStringToIntPipe, new StringToArrayPipe().Include(["tags", "productCategories"]), new EmptyStringDeletorPipe(),
  new OptionalValidatorPipe().check(["name", "description", "price", "count", "tags", "productCategories"]),new ValidationPipe())
  async editProduct(@Body() dto: Partial<UpdateProductDto>, @User() user: JwtUser, @UploadedFile() file: Express.Multer.File=undefined) {
    return await this.productsService.update(dto, user, file)
  }

  @Delete("/delete/:id")
  @ApiOperation({ summary: "Delete a product" })
  @ApiResponse({ status: 200, description: "Product deleted", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "File not exsists/Invalid path", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, SellerGuard)
  async deleteProduct(@Param("id", ParseIntPipe) id: number, @User() user: JwtUser) {
    return await this.productsService.delete(id, user)
  }
}
