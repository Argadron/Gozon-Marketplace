import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsString, Min, MinLength } from "class-validator";

export class SearchProductDto {
    @Transform(value => Number.parseInt(value.value))
    @IsNumber()
    @Min(0)
    @ApiProperty({
        description: "Products count on current/request page",
        type: Number,
        example: 50,
        minimum: 0
    })
    readonly productOnPage: number;

    @Transform(value => Number.parseInt(value.value))
    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: "Requested page",
        type: Number,
        example: 1,
        minimum: 1
    })
    readonly page: number;

    @IsString()
    @MinLength(1)
    @ApiProperty({
        description: "Product name to search",
        type: String,
        example: "product",
        minLength: 1
    })
    readonly name: string;
}