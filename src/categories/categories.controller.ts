import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerOK } from '../swagger/apiResponse.interfaces';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get("/all")
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({ status: 200, description: "Categories getted", type: SwaggerOK })
  async all() {
    return await this.categoriesService.getAll()
  }
}
