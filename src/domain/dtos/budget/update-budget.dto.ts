import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateBudgetDto {

    @IsString()
    @IsOptional()
    public name?: string;

    @IsString()
    @IsOptional()
    public description?: string;

    @IsOptional()
    @IsDateString()
    public date?: Date;

    @IsOptional()
    @IsDateString()
    public end_date?: Date;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    public readonly limit_amount?: number;

    @IsNumber()
    @IsOptional()
    public readonly current_amount?: number;

    @IsString()
    @IsOptional()
    public readonly userId?: string

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

    @IsString()
    @IsOptional()
    public readonly categories?: string;

    @IsNumber()
    @IsOptional()
    public readonly walletId?: number;

    @IsNumber()
    @IsOptional()
    public readonly percentage?: number;

    @IsBoolean()
    @IsOptional()
    public readonly active?: boolean;

    @IsOptional()
    @IsDateString()
    public next_date?: Date

}