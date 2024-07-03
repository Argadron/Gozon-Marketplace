import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class SendAlertDto {
    @IsString()
    @MinLength(1)
    @IsOptional()
    @ApiProperty({ 
        description: "Username to send alert",
        type: String,
        example: "test",
        required: false,
        minLength: 1
    })
    readonly username?: string;

    @IsString()
    @MinLength(5)
    @ApiProperty({ 
        description: "Alert body", 
        type: String,
        example: "Уведомление!",
        minLength: 5
    })
    readonly description: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ 
        description: "If true, alert send to all users",
        type: Boolean,
        required: false,
        example: false
    })
    readonly isGlobal?: boolean;
}