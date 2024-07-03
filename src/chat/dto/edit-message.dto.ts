import { IsNumber, IsString } from "class-validator";

export class EditMessageDto {
    @IsNumber()
    readonly room: number;  

    @IsNumber()
    readonly messageId: number; 

    @IsString()
    readonly message: string;
}