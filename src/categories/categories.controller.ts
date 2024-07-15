import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerCreated, SwaggerForbiddenException, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { JwtGuard } from '@guards/jwt.guard';
import { AdminGuard } from '@guards/admin.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
@ApiTags("Categories Controller")
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

  @Delete("/delete/:id")
  @ApiOperation({ summary: "Delete category" })
  @ApiResponse({ status: 200, description: "Category deleted", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "Category not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, AdminGuard)
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.categoriesService.delete(id)
  }
}
