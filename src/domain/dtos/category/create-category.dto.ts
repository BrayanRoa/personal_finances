import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsString()
    @IsNotEmpty()
    public readonly userId!: string

    @IsString()
    @IsOptional()
    public readonly icon!: string;
}