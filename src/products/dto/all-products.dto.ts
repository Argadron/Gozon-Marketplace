import { Transform } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class AllProductsDto {
    @Transform(value => Number.parseInt(value.value))
    @IsNumber()
    @Min(0)
    readonly productOnPage: number;

    @Transform(value => Number.parseInt(value.value))
    @IsNumber()
    @Min(1)
    readonly page: number;
}