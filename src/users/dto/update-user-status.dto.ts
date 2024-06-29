import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, MinLength } from "class-validator";

export class UpdateUserStatusDto {
    @IsBoolean()
    @ApiProperty({
        description: "User ban status (true - ban, false - unban)",
        type: Boolean,
        example: false
    })
    readonly status: boolean;

    @IsString()
    @MinLength(3)
    @ApiProperty({
        description: "Username to set status",
        type: String,
        example: "test",
        minLength: 3
    })
    readonly username: string;
}