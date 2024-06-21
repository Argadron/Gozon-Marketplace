export interface Tokens {
    readonly access: string;
    readonly refresh?: string;
}

export interface JwtUser {
    readonly id: number;
}