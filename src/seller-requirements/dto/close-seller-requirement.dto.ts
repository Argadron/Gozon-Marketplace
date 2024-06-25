import { IsBoolean, IsNumber, IsString, MinLength } from "class-validator";

export class CloseSellerRequirementDto {
    @IsString()
    @MinLength(5)
    readonly description: string; 

    @IsBoolean()
    readonly accepted: boolean;

    @IsNumber()
    readonly userId: number;
}