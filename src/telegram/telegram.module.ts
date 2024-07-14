import { DynamicModule, Module, OnModuleDestroy } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import config from '@config/constants'
import { TelegramUpdate } from "./telegram.update";
import { sessionsCleaner } from "./telegram.utils";
import { PrismaService } from "../prisma.service";
import { TelegramService } from "./telegram.service";
import { UsersModule } from "../users/users.module";
import { TelegramController } from "./telegram.controller";

const constants = config()

@Module({
    imports: [UsersModule],
    controllers: [TelegramController],
    providers: [TelegramUpdate, PrismaService, TelegramService],
    exports: [TelegramService]
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