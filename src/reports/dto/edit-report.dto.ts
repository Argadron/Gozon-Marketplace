import { IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class EditReportDto {
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
    readonly reportId: number;
}