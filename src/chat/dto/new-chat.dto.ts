import { IsNumber, IsString, Min, MinLength } from "class-validator";

export class NewChatDto {
    @IsString()
    @MinLength(5)
    readonly username: string;

    @IsNumber()
    @Min(1)
    readonly userId: number;
}