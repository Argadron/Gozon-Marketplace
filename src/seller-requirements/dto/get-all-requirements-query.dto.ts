import { Transform } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class GetAllRequirementsDto {
    @Transform(value => Number.parseInt(value.value))
    @IsNumber()
    @Min(0)
    readonly page: number;

    @Transform(value => Number.parseInt(value.value))
    @IsNumber()
    @Min(1)
    readonly requirementsOnPage: number;
}