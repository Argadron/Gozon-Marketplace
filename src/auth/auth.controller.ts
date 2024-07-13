import { Body, Controller, Get, HttpCode, Post, Put, Query, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse, ApiOperation, ApiBearerAuth, ApiTags, ApiCookieAuth, ApiQuery } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerJwtUser, SwaggerConflictMessage, SwaggerOK, SwaggerForbiddenException, SwaggerUnauthorizedException, SwaggerNotFound, SwaggerCreated } from '@swagger/apiResponse.interfaces';
import { Token } from './decorators/get-token.decorator';
import { User } from './decorators/get-user.decorator';
import { JwtUser } from './interfaces';
import { JwtGuard } from './guards/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EnableTwoFactorDto } from './dto/enable-two-factor.dto';

@Controller('auth')
@ApiTags("Auth Controller")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post("/register")
  @ApiResponse({ status: 201, description: "This method create a new user", type: SwaggerJwtUser})
  @ApiResponse({ status: 409, description: "User with username already exsists", type: SwaggerConflictMessage})
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiOperation({ summary: "Regiter a new user" })
  @UseInterceptors(FileInterceptor(`file`))
  async register(@Res({ passthrough: true }) res: Response, @Body() dto: AuthDto, @UploadedFile() file: Express.Multer.File=null) {
    return await this.authService.register(res, dto, file)
  }

  @UsePipes(new ValidationPipe())
  @Post("/login")
  @ApiResponse({ status: 200, description: "This method login user", type: SwaggerJwtUser })
  @ApiResponse({ status: 400, description: "User not found / Invalid password", type: SwaggerBadRequest })
  @ApiBody({
    type: AuthDto
  })
  @ApiResponse({ status: 403, description: "User are banned", type: SwaggerForbiddenException })
  @ApiOperation({ summary: "Login user" })
  @HttpCode(200)
  async login(@Res({ passthrough: true }) res: Response, @Body() dto: Partial<AuthDto>) {
    return await this.authService.login(res, dto)
  }

  @Get("/refresh")
  @HttpCode(200)
  @ApiResponse({ status: 200, description: "This method check refresh token and return new tokens", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Refresh token invalid", type: SwaggerBadRequest })
  @ApiResponse({ status: 403, description: "User are banned", type: SwaggerForbiddenException })
  @ApiOperation({ summary: "Refresh access and refresh tokens" })
  @ApiCookieAuth()
  async refresh(@Token() token: string, @Res({ passthrough: true }) res: Response) {
    if (!token) throw new UnauthorizedException("No refresh token")

    return await this.authService.refresh(token, res)
  }

  @Get("/logout")
  @HttpCode(200)
  @ApiOperation({ summary: "Logout from account" })
  @ApiResponse({ status: 200, description: "Logout success", type: SwaggerOK })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async logout(@User() user: JwtUser, @Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(user, res)
  }

  @Put("/changepassword")
  @ApiOperation({ summary: "Change password on user account" })
  @ApiResponse({ status: 200, description: "Password changed", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "Validation failed /Bad password", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 404, description: "Reset tag not found", type: SwaggerNotFound })
  @ApiResponse({ status: 409, description: "Already send email to change password (lt 5 mins from last)" })
  @ApiQuery({ name: "urlTag", required: false, type: String, description: "Add tag if change password from email" })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  async changePassword(@Body() dto: ChangePasswordDto, @User() user: JwtUser, @Query("urlTag") tag?: string) {
    return await this.authService.changePassword(dto, user, tag)
  }

  @Post("/resetPassword")
  @ApiOperation({ summary: "Reset user password" })
  @ApiResponse({ status: 201, description: "Message to reset password send to email success", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Validation failed/User not has valid email/Tags not match", type: SwaggerBadRequest })
  @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
  @ApiResponse({ status: 404, description: "User not found", type: SwaggerNotFound })
  @ApiResponse({ status: 409, description: "Already send email to reset password (lt 5 min from last)", type: SwaggerConflictMessage })
  @ApiQuery({ name: "urlTag", required: false, type: String, description: "Add tag if reset password from email" })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async resetPassword(@Body() dto: ResetPasswordDto, @Query("urlTag") urlTag?: string) {
    return await this.authService.resetPassword(dto, urlTag)
  }

  @Post("/enableTwoFactorAuth")
  @ApiOperation({ summary: "Enable twofactor auth on user account" })
  @ApiResponse({ status: 201, description: "Send email/Getted telegram link to enable auth", type: SwaggerCreated })
  @ApiResponse({ status: 400, description: "Validation failed/Not has email/telegram", type: SwaggerBadRequest })
  @ApiResponse({ status: 409, description: "User already has twoFactor", type: SwaggerConflictMessage })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtGuard)
  async enableTwoFactor(@Body() dto: EnableTwoFactorDto, @User() user: JwtUser) {
    // дописать
    return 0
  }
}
