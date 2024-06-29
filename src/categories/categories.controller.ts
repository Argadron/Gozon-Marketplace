import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerCreated, SwaggerForbiddenException, SwaggerOK, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get("/all")
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({ status: 200, description: "Categories getted", type: SwaggerOK })
  async all() {
    return await this.categoriesService.getAll()
  }

  @Post("/new")
  @ApiOperation({ summary: "Create new category" })
  @ApiResponse({ status: 201, description: "Category created", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiResponse({ status: 409, description: "Category with this name already exsists", type: SwaggerConflictMessage })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, AdminGuard)
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateCategoryDto) {
    return await this.categoriesService.create(dto)
  }
}
