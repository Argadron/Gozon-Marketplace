import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class DisconnectDto {
    @IsString()
    @MinLength(8)
    @ApiProperty({
        description: "User password",
        type: String,
        example: "12345678",
        minLength: 8
    })
    readonly password: string;
}