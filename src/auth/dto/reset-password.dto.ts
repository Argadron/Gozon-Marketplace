import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @MinLength(5)
    @ApiProperty({
        description: "Username to send reset password message",
        type: String,
        example: "testtest",
        minLength: 5
    })
    readonly username: string;

    @IsString()
    @IsOptional()
    @MinLength(8)
    @ApiProperty({
        description: "New user password",
        type: String,
        example: "123123123123123",
        minLength: 8
    })
    readonly newPassword?: string;
}