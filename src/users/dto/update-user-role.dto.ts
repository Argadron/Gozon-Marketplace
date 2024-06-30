import { ApiProperty } from "@nestjs/swagger";
import { RoleEnum } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateUserRoleDto {
    @IsString()
    @MinLength(5)
    @ApiProperty({
        description: "Username to set role",
        type: String,
        example: "Argadron",
        minLength: 5
    })
    readonly username: string;

    @IsNotEmpty()
    @ApiProperty({
        description: "Role to set",
        enum: RoleEnum,
        example: RoleEnum.USER
    })
    @IsEnum(RoleEnum)
    readonly role: RoleEnum;
}