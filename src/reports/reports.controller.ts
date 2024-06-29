import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerCreated, SwaggerForbiddenException, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';
import { EditReportDto } from './dto/edit-report.dto';
import { OptionalValidatorPipe } from '../common/pipes/optional-validator.pipe';
import { EmptyStringDeletorPipe } from '../common/pipes/empty-string-deletor.pipe';

@Controller('reports')
@UseGuards(JwtGuard)
@ApiTags("Reports Controller")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post("/new")
  @ApiOperation({ summary: "Create a new product report" })
  @ApiResponse({ status: 201, description: "Report created", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 404, description: "Product not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @ApiBody({ type: CreateReportDto })
  @UsePipes(new ValidationPipe())
  async newReport(@Body() dto: CreateReportDto, @User() user: JwtUser) {
    return await this.reportsService.create(dto, user)
  }

  @Put("/edit")
  @ApiOperation({ summary: "Edit a product report" })
  @ApiResponse({ status: 200, description: "Report edited", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "This is not your report", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "Report not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @ApiBody({ type: EditReportDto })
  @UsePipes(new EmptyStringDeletorPipe(),new OptionalValidatorPipe().check(["name", "description"]),new ValidationPipe())
  async editReport(@Body() dto: Partial<EditReportDto>, @User() user: JwtUser) {
    return await this.reportsService.edit(dto, user)
  }

  @Delete("/delete/:id")
  @ApiOperation({ summary: "Delete a product report" })
  @ApiResponse({ status: 200, description: "Report deleted", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "This is not your report", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "Report not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  async deleteReport(@Param("id", ParseIntPipe) id: number, @User() user: JwtUser) {
    return await this.reportsService.delete(id, user)
  }
}
