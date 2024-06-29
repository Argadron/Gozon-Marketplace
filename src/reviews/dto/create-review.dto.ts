import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto {
    @IsString()
    @MinLength(1)
    @ApiProperty({
        description: "Review header",
        type: String,
        example: "My first buy - this product!",
        minLength: 1
    })
    readonly name: string; 

    @IsString()
    @MinLength(5)
    @ApiProperty({
        description: "Review description",
        type: String,
        example: "This product help me with...",
        minLength: 5
    })
    readonly description: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    @ApiProperty({
        description: "Product rate",
        type: Number,
        example: 2.7,
        minimum: 1,
        maximum: 5
    })
    readonly rate: number; 

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