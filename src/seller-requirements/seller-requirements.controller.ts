import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SellerRequirementsService } from './seller-requirements.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtUser } from '../auth/interfaces';
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerCreated, SwaggerForbiddenException, SwaggerOK, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { CreateSellerRequirementDto } from './dto/create-seller-requirement.dto';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { GetAllRequirementsDto } from './dto/get-all-requirements-query.dto';
import { ObjectStringToIntPipe } from '../common/pipes/object-string-to-int.pipe';

@Controller('seller-requirements')
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
}
