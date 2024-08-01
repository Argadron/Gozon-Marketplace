import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class UpdateProductCountDto {
    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: "New count product in basket",
        type: Number,
        example: 1,
        minimum: 1
    })
    readonly count: number;
}