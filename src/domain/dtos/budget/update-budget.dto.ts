import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBudgetDto {

    @IsString()
    @IsOptional()
    public readonly name?: string;

    @IsString()
    @IsOptional()
    public description?: string;

    @IsDateString()
    @IsOptional()
    public initial_date?: Date;

    @IsDateString()
    @IsOptional()
    public end_date?: Date;

    @IsNumber()
    @IsOptional()
    public readonly amount?: number;

    @IsString()
    @IsNotEmpty()
    public readonly userId!: string

    @IsString()
    @IsOptional()
    @IsEnum([
        "EVERY DAY",
        "EVERY WEEK",
        "EVERY TWO WEEKS",
        "EVERY MONTH",
        "EVERY TWO MONTHS",
        "EVERY THREE MONTHS",
        "EVERY SIX MONTHS",
        "EVERY YEAR"
    ])
    public readonly repeat?: string;

    @IsString()
    @IsOptional()
    public readonly categories?: string;
}