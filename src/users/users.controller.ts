import { Body, Controller, Get, Put, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../auth/decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';
import { SwaggerBadRequest, SwaggerForbiddenException, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '../swagger/apiResponse.interfaces';
import { Response } from 'express';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { RoleEnum } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
@ApiTags("Users Controller")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/getProfile")
  @ApiOperation({ summary: "Get user profile" })
  @ApiResponse({ status: 200, description: "Return a user info", type: SwaggerOK })
  @ApiResponse({ status: 404, description: "User not found", type: SwaggerNotFound })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  async getProfile(@User() user: JwtUser) {
    return await this.usersService.getProfile(user.id)
  }

  @Get("/getProfilePhoto")
  @ApiOperation({ summary: "Get user profile photo" })
  @ApiResponse({ status: 200, description: "Return a user profile photo", type: SwaggerOK })
  @ApiResponse({ status: 404, description: "Profile photo not found", type: SwaggerNotFound })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  async getProfilePhoto(@User() user: JwtUser, @Res() res: Response) {
    return await this.usersService.getProfilePhoto(user, res)
  }

  @Put("/userBanStatus")
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: "Set user ban status" })
  @ApiResponse({ status: 200, description: "User ban status changed", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 404, description: "User not found", type: SwaggerNotFound })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async setUserBanStatus(@Body() dto: UpdateUserStatusDto, @User() user: JwtUser) {
    return await this.usersService.setUserBanStatus(dto, user)
  }

  @Put("/userRole")
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: "Set user role" })
  @ApiResponse({ status: 200, description: "User role changed", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 403, description: "Your role not have access to this action", type: SwaggerForbiddenException })
  @ApiResponse({ status: 404, description: "User not found", type: SwaggerNotFound })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async setUserRole(@Body() dto: UpdateUserRoleDto) {
    return await this.usersService.setUserRole(dto.role, dto.username)
  }
}
