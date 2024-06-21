import { Body, Controller, HttpCode, Post, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerJwtUser, SwaggerConflictMessage } from '../swagger/apiResponse.interfaces';

@Controller('auth')
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
  @ApiOperation({ summary: "Login user" })
  @HttpCode(200)
  async login(@Res({ passthrough: true }) res: Response, @Body() dto: Partial<AuthDto>) {
    return await this.authService.login(res, dto)
  }
}
