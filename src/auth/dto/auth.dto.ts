import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty({ message: "Username is required" })
    @MinLength(5)
    @MaxLength(30)
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    readonly password: string;
    
    @IsEmail()
    @IsOptional()
    readonly email?: string; 

    @IsPhoneNumber()
    @IsOptional()
    readonly phone?: string;

    @IsOptional()
    file?: any;
}