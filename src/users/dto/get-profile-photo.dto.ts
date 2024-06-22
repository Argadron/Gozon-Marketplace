import { IsString } from "class-validator";

export class GetProfilePhotoDto {
    @IsString()
    photoPath: string;
}