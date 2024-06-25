import { IsString } from "class-validator";

export class RegisterGateWayDto {
    @IsString()
    readonly username: string;
}