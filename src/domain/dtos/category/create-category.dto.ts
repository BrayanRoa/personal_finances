import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsString()
    @IsNotEmpty()
    public readonly userId!: string

    @IsNumber()
    @IsNotEmpty()
    public readonly colorId!: number;

    @IsNumber()
    @IsNotEmpty()
    public readonly iconId!: number;


}