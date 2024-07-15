import { ApiProperty } from "@nestjs/swagger";
import { Filters } from "../interfaces";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class AllProductsDto {
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
    @IsOptional()
    @ApiProperty({
        description: "Search filters",
        type: String,
        example: "priceMin=1+priceMax=30+tags=[\"test\"]",
        required: false
    })
    readonly filters?: Filters;
}