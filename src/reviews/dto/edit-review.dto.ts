import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class EditReviewDto {
    @IsNumber()
    @Min(1)
    @Expose()
    @ApiProperty({
        description: "Id of review",
        type: Number,
        example: 1,
        minimum: 1
    })
    reviewId: number;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @Expose()
    @ApiProperty({
        description: "New review header",
        type: String,
        example: "My new review header!",
        required: false,
        minLength: 1,
    })
    readonly name?: string; 

    @IsOptional()
    @IsString()
    @MinLength(5)
    @Expose()
    @ApiProperty({
        description: "New review description",
        type: String,
        example: "This product NO help me with...",
        required: false,
        minLength: 5
    })
    readonly description?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    @Expose()
    @ApiProperty({
        description: "New review product rate",
        type: Number,
        example: 1.2,
        required: false,
        minimum: 1,
        maximum: 5
    })
    readonly rate?: number;  
}