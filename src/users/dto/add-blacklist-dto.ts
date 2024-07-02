import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class AddBlackListDto {
    @IsString()
    @MinLength(5)
    @ApiProperty({
        description: "Username who need add to blacklist",
        type: String,
        example: "testtest",
        minLength: 5
    })
    readonly username: string;
}