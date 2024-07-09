import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ConfigService } from "@nestjs/config";

@Module({
    providers: [EmailService, ConfigService],
    exports: [EmailService, ConfigService]
})
export class EmailModule {}