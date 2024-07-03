import { IsNumber, IsString } from "class-validator";

export class NewMessageDto {
    @IsString()
    readonly message: string;

    @IsNumber()
    readonly room: number;
}