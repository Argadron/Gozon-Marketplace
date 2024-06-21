import { Body, Controller, HttpCode, Post, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post("/register")
  @ApiResponse({ status: 201, description: "This method create a new user" })
  @ApiResponse({ status: 409, description: "User with username already exsists" })
  @ApiResponse({ status: 400, description: "Validation failed" })
  @UseInterceptors(FileInterceptor(`file`))
  async register(@Res({ passthrough: true }) res: Response, @Body() dto: AuthDto, @UploadedFile() file: Express.Multer.File=null) {
    return await this.authService.register(res, dto, file)
  }

  @UsePipes(new ValidationPipe())
  @Post("/login")
  @ApiResponse({ status: 200, description: "This method login user" })
  @ApiResponse({ status: 400, description: "User not found / Invalid password" })
  @ApiBody({
    type: AuthDto
  })
  @HttpCode(200)
  async login(@Res({ passthrough: true }) res: Response, @Body() dto: Partial<AuthDto>) {
    return await this.authService.login(res, dto)
  }
}
