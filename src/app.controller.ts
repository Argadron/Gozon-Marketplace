import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerOK } from '@swagger/apiResponse.interfaces';

@Controller()
@ApiTags("Server work test controller")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Test the server worked" })
  @ApiResponse({ status: 200, description: "This method return Server worked!", type: SwaggerOK })
  getHello(): string {
    return this.appService.getHello();
  }
}
