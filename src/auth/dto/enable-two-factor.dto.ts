import { ApiProperty } from "@nestjs/swagger";
import { twoFactorAuthEnum } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class EnableTwoFactorDto {
    @ApiProperty({
        enum: twoFactorAuthEnum,
        example: twoFactorAuthEnum.TELEGRAM
    })
    @IsNotEmpty()
    @IsEnum(twoFactorAuthEnum)
    readonly type: twoFactorAuthEnum;
}