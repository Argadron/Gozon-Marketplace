export interface Filters {
    readonly priceMin?: number;

    readonly priceMax?: number;

    readonly createdAt?: Date;

    readonly tags?: string[];

    readonly categories?: string[]

    readonly UpOrDown?: boolean;
}

export class Filters {
    readonly priceMin?: number;

    readonly priceMax?: number;

    readonly createdAt?: Date;

    readonly tags?: string[];

    readonly categories?: string[]

    readonly UpOrDown?: boolean;
}

export interface UpdateData {
    readonly rate?: number;

    readonly reportsCount?: number;
}