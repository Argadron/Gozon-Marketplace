import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Filters } from "../interfaces";

export class AllProductsDto {
    @Transform(value => Number.parseInt(value.value))
    @IsNumber()
    @Min(0)
    readonly productOnPage: number;

    @Transform(value => Number.parseInt(value.value))
    @IsNumber()
    @Min(1)
    readonly page: number;

    @IsString()
    @IsOptional()
    readonly filter?: Filters;
}