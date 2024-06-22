import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';
import { SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/getProfile")
  @ApiOperation({ description: "Get user profile" })
  @ApiResponse({ status: 200, description: "Return a user info", type: SwaggerOK })
  @ApiResponse({ status: 404, description: "User not found", type: SwaggerNotFound })
  @ApiResponse({ status: 401, description: "Token invalid / No token", type: SwaggerUnauthorizedException })
  async getProfile(@User() user: JwtUser) {
    return await this.usersService.getProfile(user)
  }
}
