import { Controller, Get, UseGuards } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { SwaggerOK, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';

@Controller('blacklist')
@UseGuards(JwtGuard)
@ApiTags("BlackList Controller")
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Get("/get")
  @ApiOperation({ summary: "Get all user blacklist ids" })
  @ApiResponse({ status: 200, description: "Blacklist getted", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  async getAll(@User() user: JwtUser) {
    return await this.blacklistService.all(user)
  }
}
