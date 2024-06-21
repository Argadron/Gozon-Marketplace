import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty({ message: "Username is required" })
    @MinLength(5)
    @MaxLength(30)
    @ApiProperty({ description: "User login" })
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    @ApiProperty({ description: "User password" })
    readonly password: string;
    
    @IsEmail()
    @IsOptional()
    @ApiProperty({ description: "User Email" })
    readonly email?: string; 

    @IsPhoneNumber()
    @IsOptional()
    @ApiProperty({ description: "User phone" })
    readonly phone?: string;

    @IsOptional()
    @ApiProperty({ description: "User photo profile" })
    file?: any;
}