import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class AddProductDto {
    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: "Id of product",
        type: Number,
        example: 1,
        minimum: 1
    })
    readonly productId: number;

    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: "Count of product",
        type: Number,
        example: 1,
        minimum: 1
    })
    readonly productCount: number;
}