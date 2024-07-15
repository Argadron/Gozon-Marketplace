import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailController } from "./email.controller";
import { UsersModule } from "../users/users.module";
import { EmailService } from "./email.service";
import { PrismaService } from "../prisma.service";

@Module({
    imports: [UsersModule],
    controllers: [EmailController],
    providers: [EmailService, ConfigService, PrismaService],
    exports: [EmailService, ConfigService]
})
export class EmailModule {}