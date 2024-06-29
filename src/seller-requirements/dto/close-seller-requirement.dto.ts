import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString, MinLength } from "class-validator";

export class CloseSellerRequirementDto {
    @IsString()
    @MinLength(5)
    @ApiProperty({
        description: "Text of close requirement",
        type: String,
        example: "You accepted!",
        minLength: 5
    })
    readonly description: string; 

    @IsBoolean()
    @ApiProperty({
        description: "Is requirement accepted",
        type: Boolean,
        example: false
    })
    readonly accepted: boolean;

    @IsNumber()
    @ApiProperty({
        description: "Id of user",
        type: Number,
        example: 1
    })
    readonly userId: number;
}