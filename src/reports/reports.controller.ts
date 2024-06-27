import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerCreated, SwaggerNotFound, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';

@Controller('reports')
@UseGuards(JwtGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post("/new")
  @ApiOperation({ summary: "Create a new product report" })
  @ApiResponse({ status: 201, description: "Report created", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 404, description: "Product not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async newReport(@Body() dto: CreateReportDto, @User() user: JwtUser) {
    return await this.reportsService.create(dto, user)
  }
}
