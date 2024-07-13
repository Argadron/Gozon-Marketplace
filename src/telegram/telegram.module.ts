import { Module, OnModuleDestroy } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import config from '@config/constants'
import { TelegramUpdate } from "./telegram.update";
import { sessionsCleaner } from "./telegram.utils";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import { TelegramService } from "./telegram.service";
import { UsersModule } from "../users/users.module";
import { TelegramController } from "./telegram.controller";

const constants = config()

@Module({
    imports: [TelegrafModule.forRoot({
        token: constants.TELEGRAM_API_KEY
    }), UsersModule],
    controllers: [TelegramController],
    providers: [TelegramUpdate, JwtService, PrismaService, TelegramService],
    exports: [TelegramService]
})
export class TelegramModule implements OnModuleDestroy {
    onModuleDestroy() {
        sessionsCleaner()
    }
}