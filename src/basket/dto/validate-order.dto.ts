import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ValidateOrderDto {
    @IsString()
    @MinLength(1)
    @ApiProperty({
        description: "Url tag from query",
        type: String,
        example: "5-5-5-5",
        minLength: 1
    })
    readonly urlTag: string; 

    @IsString()
    @MinLength(1)
    @ApiProperty({
        description: "Session id from return object",
        type: String,
        example: "session_123",
        minLength: 1
    })
    readonly sessionId: string;
}