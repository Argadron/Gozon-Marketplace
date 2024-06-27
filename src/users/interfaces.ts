import { AuthDto } from "../auth/dto/auth.dto";

export interface CreateUser extends AuthDto {
    readonly password: string;

    readonly profilePhoto: string;
}