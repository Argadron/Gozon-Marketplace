import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SellerRequirementsService } from './seller-requirements.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtUser } from '../auth/interfaces';
import { SwaggerCreated, SwaggerForbiddenException, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { CreateSellerRequirementDto } from './dto/create-seller-requirement.dto';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('seller-requirements')
export class SellerRequirementsController {
  constructor(private readonly sellerRequirementsService: SellerRequirementsService) {}

  @Post("/createSellerRequirement")
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: "Create a user seller role requirement" })
  @ApiResponse({ status: 201, description: "Requirement created", type: SwaggerCreated })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Already has role seller", type: SwaggerForbiddenException })
  @ApiResponse({ status: 400, description: "Validation failed /Requirement already exsists" })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async createSellerRequiremenet(@Body() dto: CreateSellerRequirementDto, @User() user: JwtUser) {
    return await this.sellerRequirementsService.createSellerRequirement(dto, user)
  }
}
