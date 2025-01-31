import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    public name?: string;

    @IsString()
    @IsOptional()
    public readonly userId?: string

    @IsNumber()
    @IsOptional()
    public readonly colorId?: number;

    @IsNumber()
    @IsOptional()
    public readonly iconId?: number;
}