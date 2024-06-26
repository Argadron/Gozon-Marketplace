import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class EditReviewDto {
    @IsNumber()
    @Min(1)
    reviewId: number;

    @IsString()
    @MinLength(1)
    @IsOptional()
    readonly name?: string; 

    @IsString()
    @MinLength(5)
    @IsOptional()
    readonly description?: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    @IsOptional()
    readonly rate?: number; 

    @IsNumber()
    @Min(1)
    productId: number; 
}