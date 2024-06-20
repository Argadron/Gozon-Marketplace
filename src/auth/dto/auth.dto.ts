import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty({ message: "Username is required" })
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
    
    @IsString()
    @IsOptional()
    readonly email?: string; 

    @IsString()
    @IsOptional()
    readonly phone?: string;

    @IsString()
    readonly profilePhoto: string;
}