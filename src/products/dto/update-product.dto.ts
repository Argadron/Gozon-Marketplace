import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateProductDto {
    @IsNumber()
    @Min(1)
    @Expose()
    @ApiProperty({
        description: "Product id",
        type: Number,
        example: 1,
        minimum: 1
    })
    readonly id: number;

    @IsString()
    @MinLength(5)
    @IsOptional()
    @Expose()
    @ApiProperty({
        description: "New product name",
        type: String,
        example: "Product two",
        minLength: 5,
        required: false
    })
    readonly name?: string;

    @IsString()
    @MinLength(10)
    @IsOptional()
    @Expose()
    @ApiProperty({
        description: "New product description",
        type: String,
        minLength: 10,
        required: false
    })
    readonly description?: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    @Expose()
    @ApiProperty({
        description: "New product price",
        type: Number,
        example: 500,
        required: false,
        minimum: 1
    })
    readonly price?: number; 

    @IsNumber()
    @Min(1)
    @IsOptional()
    @Expose()
    @ApiProperty({
        description: "New product count",
        type: Number,
        example: 100,
        required: false,
        minimum: 1
    })
    readonly count?: number; 

    @IsArray()
    @IsOptional()
    @Expose()
    @ApiProperty({
        description: "New product tags",
        type: [String],
        example: ["tag2"],
        required: false
    })
    readonly tags?: string[];

    @IsArray()
    @IsOptional()
    @Expose()
    @ApiProperty({
        description: "New product categories",
        type: [String],
        example: ["category2"],
        required: false
    })
    readonly categories?: string[];

    @IsOptional()
    @Expose()
    @ApiProperty({
        description: "New product photo",
        type: String,
        example: "Must be a new product photo",
        required: false
    })
    productPhoto?: string;
}