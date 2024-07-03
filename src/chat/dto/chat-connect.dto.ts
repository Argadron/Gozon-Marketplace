import { IsString, MinLength } from "class-validator";

export class ChatConnectDto {
    @IsString()
    @MinLength(5)
    readonly username: string;
}