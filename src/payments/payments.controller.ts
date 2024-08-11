import { Controller, Delete, Get, ParseIntPipe, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '@guards/roles.guard';
import { Auth } from '@decorators/auth.decorator';
import { Roles } from '@decorators/roles.decorator';
import { SwaggerBadRequest, SwaggerForbiddenException, SwaggerNoContent, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { PaymentsService } from './payments.service';

@Controller('payments')
@ApiTags("Payments Controller")
@Auth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("/all")
  @ApiOperation({ summary: "Get all payments need to pay" })
  @ApiResponse({ status: 200, description: "Payments getted", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  async getAll() {
    return await this.paymentsService.getAll()
  }

  @Delete("/delete/:id")
  @ApiOperation({ summary: "Delete payment" })
  @ApiResponse({ status: 200, description: "Payment deleted", type: SwaggerNoContent })
  @ApiResponse({ status: 400, description: "Id must be numeric string", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "Payment not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.paymentsService.delete(id)
  }
}
