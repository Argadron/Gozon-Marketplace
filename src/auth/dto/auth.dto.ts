import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty({ message: "Username is required" })
    @MinLength(5)
    @MaxLength(30)
    @ApiProperty({ 
        description: "User login",
        type: String, 
        example: "User123",
        minLength: 5,
        maxLength: 30
    })
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    @ApiProperty({ 
        description: "User password",
        type: String,
        example: "passwordqwerty",
        minLength: 8,
        maxLength: 30
    })
    readonly password: string;
    
    @IsEmail()
    @IsOptional()
    @ApiProperty({ 
        description: "User Email",
        type: String,
        example: "test@gmail.com",
        required: false
    })
    readonly email?: string; 

    @IsPhoneNumber()
    @IsOptional()
    @ApiProperty({ 
        description: "User phone",
        type: String,
        example: "+78005003535",
        required: false
    })
    readonly phone?: string;

    @IsOptional()
    @ApiProperty({ 
        description: "User photo profile",
        type: String,
        example: "This must be a file",
        required: false
    })
    file?: any;
}