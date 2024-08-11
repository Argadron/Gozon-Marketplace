import { Body, Controller, Delete, HttpCode, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "@decorators/get-user.decorator";
import { Auth } from "@decorators/auth.decorator";
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerCreated, SwaggerNoContent, SwaggerUnauthorizedException } from "@swagger/apiResponse.interfaces";
import { DisconnectDto } from "./dto/disconnect.dto";
import { TelegramService } from "./telegram.service";
import { JwtUser } from "../auth/interfaces";

@Controller("/telegram")
@ApiTags("Telegram Controller")
@Auth()
export class TelegramController {
    constructor (private readonly telegramService: TelegramService) {}

    @Post("/createConnect")
    @ApiOperation({ summary: "Create secret key to activate on telegram to connect account" })
    @ApiResponse({ status: 201, description: "Connected key", type: SwaggerCreated })
    @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
    @ApiResponse({ status: 409, description: "Already has telegram verification", type: SwaggerConflictMessage })
    @ApiBearerAuth()
    async createConnect(@User() user: JwtUser) {
        return await this.telegramService.createAuthTag(user)
    }

    @Delete("/disconnect")
    @ApiOperation({ summary: "Disconnect telegram account" })
    @ApiResponse({ status: 204, description: "Account disconnected", type: SwaggerNoContent })
    @ApiResponse({ status: 400, description: "You not have valid telegram connect /Passwords not match /Validation failed", type: SwaggerBadRequest })
    @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
    @ApiBearerAuth()
    @HttpCode(204)
    @UsePipes(new ValidationPipe())
    async disconnect(@Body() dto: DisconnectDto, @User() user: JwtUser) {
        return await this.telegramService.disconnect(dto, user)
    }
}