import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @ApiProperty({
        description: "Old user password",
        type: String,
        example: "123456789",
        minLength: 8,
        maxLength: 30
    })
    readonly oldPassword: string; 

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @ApiProperty({
        description: "New user password",
        type: String,
        example: "987654321",
        minLength: 8,
        maxLength: 30
    })
    readonly newPassword: string;
}