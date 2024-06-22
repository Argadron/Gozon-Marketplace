import { RoleEnum } from "@prisma/client";

export interface Tokens {
    readonly access: string;
    readonly refresh?: string;
}

export interface JwtUser {
    readonly id: number;

    readonly role: RoleEnum;
}