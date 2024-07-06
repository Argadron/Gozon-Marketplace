import { Body, Controller, Get, HttpCode, Post, Put, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse, ApiOperation, ApiBearerAuth, ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerJwtUser, SwaggerConflictMessage, SwaggerOK, SwaggerForbiddenException, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { Token } from './decorators/get-token.decorator';
import { User } from './decorators/get-user.decorator';
import { JwtUser } from './interfaces';
import { JwtGuard } from './guards/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

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
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  async changePassword(@Body() dto: ChangePasswordDto, @User() user: JwtUser) {
    return await this.authService.changePassword(dto, user)
  }
}
