import { IsNumber, IsString, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto {
    @IsString()
    @MinLength(1)
    readonly name: string; 

    @IsString()
    @MinLength(5)
    readonly description: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    readonly rate: number; 

    @IsNumber()
    @Min(1)
    readonly productId: number; 
}