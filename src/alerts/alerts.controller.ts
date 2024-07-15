import { Body, Controller, Delete, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerCreated, SwaggerForbiddenException, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { JwtGuard } from '@guards/jwt.guard';
import { AdminGuard } from '@guards/admin.guard';
import { User } from '@decorators/get-user.decorator';
import { OptionalValidatorPipe } from '@pipes/optional-validator.pipe';
import { SendAlertDto } from './dto/send-alert.dto';
import { AlertsService } from './alerts.service';
import { JwtUser } from '../auth/interfaces';


@Controller('alerts')
@UseGuards(JwtGuard)
@ApiTags("Alert Controller")
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}
  
  @Post("/send")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Send a alerts to users" })
  @ApiResponse({ status: 201, description: "Alert sended", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid /Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "User not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @UsePipes(new OptionalValidatorPipe().check(["username", "isGlobal"]),new ValidationPipe())
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

  @Delete("/deleteAll")
  @ApiOperation({ summary: "Delete ALL alerts" })
  @ApiResponse({ status: 200, description: "Alerts deleted", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  async deleteAll(@User() user: JwtUser) {
    return await this.alertsService.deleteAll(user)
  }
}
