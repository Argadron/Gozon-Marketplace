import { Body, Controller, Delete, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerCreated, SwaggerForbiddenException, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { SendAlertDto } from './dto/send-alert.dto';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';

@Controller('alerts')
@UseGuards(JwtGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}
  
  @Post("/send")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Send a alerts to users" })
  @ApiResponse({ status: 200, description: "Alert sended", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid /Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "User not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async send(@Body() dto: SendAlertDto) {
    return await this.alertsService.send(dto)
  }

  @Delete("/delete/:id")
  @ApiOperation({ summary: "Delete one alert" })
  @ApiResponse({ status: 200, description: "Alert deleted", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "This is not your alert", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "Alert not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  async deleteOne(@Param("id", ParseIntPipe) id: number, @User() user: JwtUser) {
    return await this.alertsService.deleteOne(id, user)
  }
}
