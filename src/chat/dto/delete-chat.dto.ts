import { IsNumber } from "class-validator";

export class DeleteChatDto {
    @IsNumber()
    readonly chatId: number;
}