import { DynamicModule, Module, OnModuleDestroy } from "@nestjs/common";
import { DEFAULT_BOT_NAME, TelegrafModule } from "nestjs-telegraf";
import config from '@config/constants'
import { TelegramUpdate } from "./telegram.update";
import { sessionsCleaner } from "./telegram.utils";
import { PrismaService } from "../prisma.service";
import { TelegramService } from "./telegram.service";
import { UsersModule } from "../users/users.module";
import { TelegramController } from "./telegram.controller";
import { Context, Telegraf } from "telegraf";

const constants = config()

@Module({
    imports: [UsersModule],
    controllers: [TelegramController],
    providers: [TelegramUpdate, PrismaService, TelegramService, {
        provide: DEFAULT_BOT_NAME,
        useValue: Telegraf<Context>
    }],
    exports: [TelegramService, DEFAULT_BOT_NAME]
})
export class TelegramModule implements OnModuleDestroy {
    onModuleDestroy() {
        sessionsCleaner()
    }

    static forRoot(): DynamicModule {
        return {
            module: TelegramModule,
            imports: [TelegrafModule.forRoot({
                token: constants.TELEGRAM_API_KEY
            })]
        }
    }
}