import { IsArray, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateProductDto {
    @IsNumber()
    @Min(1)
    readonly id: number;

    @IsString()
    @MinLength(5)
    @IsOptional()
    readonly name?: string;

    @IsString()
    @MinLength(10)
    @IsOptional()
    readonly description?: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    readonly price?: number; 

    @IsNumber()
    @Min(1)
    @IsOptional()
    readonly count?: number; 

    @IsArray()
    @IsOptional()
    readonly tags?: string[];

    @IsArray()
    @IsOptional()
    readonly productCategories?: string[];

    @IsOptional()
    productPhoto?: string;
}