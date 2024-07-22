import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBudgetDto {

    @IsString()
    @IsOptional()
    public readonly name?: string;

    @IsString()
    @IsOptional()
    public description?: string;

    @IsNumber()
    @IsOptional()
    public readonly limit_amount?: number;

    @IsString()
    @IsNotEmpty()
    public readonly userId!: string

    @IsString()
    @IsOptional()
    @IsEnum([
        "EVERY WEEK",
        "EVERY TWO WEEKS",
        "EVERY MONTH",
        "EVERY TWO MONTHS",
        "EVERY THREE MONTHS",
        "EVERY SIX MONTHS",
        "EVERY YEAR",
        "NEVER"
    ])
    public readonly repeat?: string;
}