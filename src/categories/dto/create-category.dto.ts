import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @MinLength(1)
    @ApiProperty({
        description: "Category name",
        type: String,
        example: "Electronic",
        minLength: 1
    })
    readonly name: string;
}