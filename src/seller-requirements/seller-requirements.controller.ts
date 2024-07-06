import { Body, Controller, Get, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SellerRequirementsService } from './seller-requirements.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtUser } from '../auth/interfaces';
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerCreated, SwaggerForbiddenException, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { CreateSellerRequirementDto } from './dto/create-seller-requirement.dto';
import { User } from '@decorators/get-user.decorator';
import { JwtGuard } from '@guards/jwt.guard';
import { AdminGuard } from '@guards/admin.guard';
import { GetAllRequirementsDto } from './dto/get-all-requirements-query.dto';
import { ObjectStringToIntPipe } from '@pipes/object-string-to-int.pipe';
import { CloseSellerRequirementDto } from './dto/close-seller-requirement.dto';

@Controller('seller-requirements')
@ApiTags("Seller-Requirements Controller")
export class SellerRequirementsController {
  constructor(private readonly sellerRequirementsService: SellerRequirementsService) {}

  @Post("/createSellerRequirement")
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: "Create a user seller role requirement" })
  @ApiResponse({ status: 201, description: "Requirement created", type: SwaggerCreated })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Already has role seller", type: SwaggerForbiddenException })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 409, description: "You already has a seller requirement", type: SwaggerConflictMessage })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async createSellerRequiremenet(@Body() dto: CreateSellerRequirementDto, @User() user: JwtUser) {
    return await this.sellerRequirementsService.createSellerRequirement(dto, user)
  }

  @Get("/all")
  @ApiOperation({ summary: "Return all seller requirements" })
  @ApiResponse({ status: 200, description: "All seller requirements", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiQuery({ name: "page" })
  @ApiQuery({ name: "requirementsOnPage" })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtGuard, AdminGuard)
  async getAll(@Query(ObjectStringToIntPipe) query: GetAllRequirementsDto) {
    return await this.sellerRequirementsService.getAll(query)
  }

  @Put("/closeRequirement")
  @ApiOperation({ summary: "Admin method to reply a seller requirement" })
  @ApiResponse({ status: 200, description: "Seller requirement closed", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "Validation failed/User not have valid seller requirement", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "User not found", type: SwaggerNotFound })
  @ApiResponse({ status: 409, description: "User already has seller role", type: SwaggerConflictMessage })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtGuard, AdminGuard)
  async close(@Body() dto: CloseSellerRequirementDto) {
    return await this.sellerRequirementsService.close(dto)
  }
}
