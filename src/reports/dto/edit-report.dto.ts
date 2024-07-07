import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class EditReportDto {
    @IsString()
    @MinLength(1)
    @IsOptional()
    @Expose()
    @ApiProperty({
        description: "New report header",
        type: String,
        example: "Very very bad product",
        required: false,
        minLength: 1
    })
    readonly name?: string;

    @IsString()
    @MinLength(5)
    @IsOptional()
    @Expose()
    @ApiProperty({
        description: "New report description",
        type: String,
        example: "Very bad product!",
        required: false,
        minLength: 5
    })
    readonly description?: string; 

    @IsNumber()
    @Min(1)
    @Expose()
    @ApiProperty({
        description: "Id of report",
        type: Number,
        example: 1,
        minimum: 1
    })
    readonly reportId: number;
}