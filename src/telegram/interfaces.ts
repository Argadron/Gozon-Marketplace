export interface SessionWriteData {
    readonly telegramId: number;
    data: any
}

export interface Sessions {
    readonly sessions: SessionWriteData[]
}

export interface createAuthTag {
    readonly userId: number;
    readonly authToken: string;
}

export interface CreateConnect {
    readonly username: string; 
    readonly password: string;
    readonly telegramId: number;
}