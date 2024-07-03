import { IsString, MinLength } from "class-validator";

export class NewChatDto {
    @IsString()
    @MinLength(5)
    readonly username: string;
}