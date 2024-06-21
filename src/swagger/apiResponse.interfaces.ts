import { ApiProperty } from "@nestjs/swagger";

export class SwaggerJwtUser {
    @ApiProperty({ description: "Access token", default: "epfkpgdkgfdpdddgdk" })
    readonly access: string;

    @ApiProperty({ description: "Refresh token (only development mode)", default: "egpfdkg[pd" })
    readonly refresh: string;
}

export class SwaggerOK {
    @ApiProperty({ description: "Code from response", default: 200 })
    readonly statusCode: number;

    @ApiProperty({ description: "Response message", default: "User info data..." })
    readonly message: string; 

    @ApiProperty({ description: "Error message", default: null })
    readonly error: string;
}

export class SwaggerBadRequest {
    @ApiProperty({ description: "Code from response", default: 400 })
    readonly statusCode: number; 

    @ApiProperty({ description: "Response message", default: "Username must be a string" })
    readonly message: string; 

    @ApiProperty({ description: "Error message", default: "BadRequest Execption" })
    readonly error: string;
}

export class SwaggerConflictMessage {
    @ApiProperty({ description: "Code from response", default: 409 })
    readonly statusCode: number;

    @ApiProperty({ description: "Response message", default: "User with email already exsists" })
    readonly message: string;

    @ApiProperty({ description: "Error message", default: "Conflict Exception" })
    readonly error: string;
}