import { IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateReportDto {
    @IsString()
    @MinLength(1)
    readonly name: string;

    @IsString()
    @MinLength(5)
    readonly description: string; 

    @IsNumber()
    @Min(1)
    readonly productId: number;
}