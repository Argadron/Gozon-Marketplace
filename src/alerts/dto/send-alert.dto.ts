import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class SendAlertDto {
    @IsString()
    @MinLength(1)
    @IsOptional()
    readonly username?: string;

    @IsString()
    @MinLength(5)
    readonly description: string;

    @IsString()
    @IsOptional()
    readonly room?: string;

    @IsBoolean()
    @IsOptional()
    readonly isGlobal?: boolean;
}