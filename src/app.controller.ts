import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Test the server worked" })
  @ApiResponse({ status: 200, description: "This method return Server worked!" })
  getHello(): string {
    return this.appService.getHello();
  }
}
