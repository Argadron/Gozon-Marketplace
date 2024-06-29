import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class GetAllRequirementsDto {
    @Transform(value => Number.parseInt(value.value))
    @IsNumber()
    @Min(0)
    @ApiProperty({
        description: "Requested page",
        type: Number,
        example: 1,
        minimum: 0
    })
    readonly page: number;

    @Transform(value => Number.parseInt(value.value))
    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: "Requestes count on page",
        type: Number,
        example: 50,
        minimum: 1
    })
    readonly requirementsOnPage: number;
}