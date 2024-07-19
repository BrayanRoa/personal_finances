import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateBudgetDto {

    @IsString()
    @IsOptional()
    public message?: string;

    @IsString()
    @IsOptional()
    public title?: string;

    @IsNotEmpty()
    @IsOptional()
    @IsBoolean()
    public read?: boolean;

    @IsString()
    @IsOptional()
    public readonly userId?: string
}