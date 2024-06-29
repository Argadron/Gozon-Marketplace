import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateReportDto {
    @IsString()
    @MinLength(1)
    @ApiProperty({
        description: "Report header",
        type: String,
        example: "Bad product",
        minLength: 1
    })
    readonly name: string;

    @IsString()
    @MinLength(5)
    @ApiProperty({
        description: "Report description",
        type: String,
        example: "Very bad!",
        minLength: 5
    })
    readonly description: string; 

    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: "Id of product",
        type: Number,
        example: 1,
        minimum: 1
    })
    readonly productId: number;
}