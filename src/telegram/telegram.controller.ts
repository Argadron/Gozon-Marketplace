import { JwtGuard } from "@guards/jwt.guard";
import { Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TelegramService } from "./telegram.service";
import { SwaggerConflictMessage, SwaggerCreated, SwaggerUnauthorizedException } from "@swagger/apiResponse.interfaces";
import { JwtUser } from "../auth/interfaces";
import { User } from "@decorators/get-user.decorator";

@Controller("/telegram")
@ApiTags("Telegram Controller")
@UseGuards(JwtGuard)
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
}