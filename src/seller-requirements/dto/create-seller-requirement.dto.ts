import { IsBoolean, IsEmail, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class CreateSellerRequirementDto {
    @IsString()
    @MinLength(5)
    readonly fio: string;

    @IsPhoneNumber()
    readonly phone: string; 

    @IsEmail()
    readonly email: string; 

    @IsString()
    @MinLength(5)
    readonly description: string;

    @IsBoolean()
    readonly isCompany: boolean;
}