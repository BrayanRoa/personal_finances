import { IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    public readonly name?: string;

    @IsString()
    @IsOptional()
    public readonly icon?: string;
}