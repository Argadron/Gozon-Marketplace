export interface templateObject {
    readonly name: string;

    readonly action: string;

    readonly url: string;
}

export interface EmailOptions {
    readonly to: string;

    readonly subject: string;

    readonly text: string;

    readonly templateObject: templateObject;
}