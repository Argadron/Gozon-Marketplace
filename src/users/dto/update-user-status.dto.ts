import { IsBoolean, IsString, MinLength } from "class-validator";

export class UpdateUserStatusDto {
    @IsBoolean()
    readonly status: boolean;

    @IsString()
    @MinLength(3)
    readonly username: string;
}