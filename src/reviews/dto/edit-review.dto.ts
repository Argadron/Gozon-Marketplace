import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class EditReviewDto {
    @IsNumber()
    @Min(1)
    reviewId: number;

    @IsOptional()
    @IsString()
    @MinLength(1)
    readonly name?: string; 

    @IsOptional()
    @IsString()
    @MinLength(5)
    readonly description?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    readonly rate?: number; 

    @IsNumber()
    @Min(1)
    productId: number; 
}