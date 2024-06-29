import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(5)
    @ApiProperty({
        description: "Product name",
        type: String,
        example: "Phone",
        minLength: 5
    })
    readonly name: string;

    @IsString()
    @MinLength(10) 
    @ApiProperty({
        description: "Product description",
        type: String,
        example: "Iphone 15",
        minLength: 10
    })
    readonly description: string; 

    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: "Product price",
        type: Number,
        example: 50.25,
        minimum: 1
    })
    readonly price: number;
    
    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: "Product count",
        type: Number,
        example: 5000,
        minimum: 1
    })
    readonly count: number; 

    @IsArray()
    @IsOptional()
    @ApiProperty({
        description: "Array strings of product tags",
        type: [String],
        example: "[\"tag1\"]",
        required: false
    })
    readonly tags?: string[];

    @IsArray()
    @IsOptional()
    @ApiProperty({
        description: "Array strings of product categories",
        type: [String],
        example: "[\"category1\"]",
        required: false
    })
    readonly categories?: string[];

    @IsOptional()
    @ApiProperty({
        description: "Product photo",
        type: String,
        example: "Must be file",
        required: false
    })
    productPhoto?: string;
}