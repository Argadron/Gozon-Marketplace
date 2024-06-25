import { IsNumber, Min } from "class-validator";

export class AddProductDto {
    @IsNumber()
    @Min(1)
    readonly productId: number;

    @IsNumber()
    @Min(1)
    readonly productCount: number;
}