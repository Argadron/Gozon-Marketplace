import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class CreateSellerRequirementDto {
    @IsString()
    @MinLength(5)
    @ApiProperty({
        description: "Full user FIO",
        type: String,
        example: "Test Test Test",
        minLength: 5
    })
    readonly fio: string;

    @IsPhoneNumber()
    @ApiProperty({
        description: "User phone",
        type: String,
        example: "+78005003535",
        minLength: 11,
        maxLength: 11
    })
    readonly phone: string; 

    @IsEmail()
    @ApiProperty({
        description: "User email",
        type: String,
        example: "test@gmail.com"
    })
    readonly email: string; 

    @IsString()
    @MinLength(5)
    @ApiProperty({
        description: "User requirement description",
        type: String,
        example: "Please, give me seller!",
        minLength: 5
    })
    readonly description: string;

    @IsBoolean()
    @ApiProperty({
        description: "User - face of company",
        type: Boolean,
        example: true
    })
    readonly isCompany: boolean;
}