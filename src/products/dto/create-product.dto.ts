import { IsArray, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(5)
    readonly name: string;

    @IsString()
    @MinLength(10) 
    readonly description: string; 

    @IsNumber()
    @Min(1)
    readonly price: number;
    
    @IsNumber()
    @Min(1)
    readonly count: number; 

    @IsArray()
    @IsOptional()
    readonly tags?: string[];

    @IsArray()
    @IsOptional()
    readonly productCategories?: string[];

    @IsOptional()
    productPhoto?: string;
}