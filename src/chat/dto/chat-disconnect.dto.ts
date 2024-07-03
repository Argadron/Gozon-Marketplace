import { IsNumber } from "class-validator";

export class ChatDisconnectDto {
    @IsNumber()
    readonly room: number;
}