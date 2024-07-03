import { IsNumber } from "class-validator";

export class DeleteMessageDto {
    @IsNumber()
    readonly room: number;

    @IsNumber()
    readonly messageId: number;
}