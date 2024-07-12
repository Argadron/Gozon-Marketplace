import { Controller, Delete, Get, ParseIntPipe, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@guards/admin.guard';
import { SwaggerBadRequest, SwaggerForbiddenException, SwaggerNoContent, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';

@Controller('payments')
@ApiTags("Payments Controller")
@UseGuards(AdminGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("/all")
  @ApiOperation({ summary: "Get all payments need to pay" })
  @ApiResponse({ status: 200, description: "Payments getted", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
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
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.paymentsService.delete(id)
  }
}
