import { Controller, Get, Header, Query, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';
import { SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { Response } from 'express';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/getProfile")
  @ApiOperation({ summary: "Get user profile" })
  @ApiResponse({ status: 200, description: "Return a user info", type: SwaggerOK })
  @ApiResponse({ status: 404, description: "User not found", type: SwaggerNotFound })
  @ApiResponse({ status: 401, description: "Token invalid / No token", type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  async getProfile(@User() user: JwtUser) {
    return await this.usersService.getProfile(user)
  }

  @Get("/getProfilePhoto")
  @ApiOperation({ summary: "Get user profile photo" })
  @ApiResponse({ status: 200, description: "Return a user profile photo", type: SwaggerOK })
  @ApiResponse({ status: 404, description: "Profile photo not found", type: SwaggerNotFound })
  @ApiResponse({ status: 401, description: "Token invalid / No token", type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  async getProfilePhoto(@User() user: JwtUser, @Res() res: Response) {
    return await this.usersService.getProfilePhoto(user, res)
  }
}