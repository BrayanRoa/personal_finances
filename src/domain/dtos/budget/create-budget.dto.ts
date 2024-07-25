import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateBudgetDto {

    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsString()
    @IsOptional()
    public description!: string;

    @IsNotEmpty()
    @IsDateString()
    public date!: Date;

    @IsNotEmpty()
    @IsDateString()
    public end_date!: Date;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    public readonly limit_amount!: number;

    @IsNumber()
    @IsNotEmpty()
    public readonly current_amount!: number;

    @IsString()
    @IsNotEmpty()
    public readonly userId!: string

    @IsString()
    @IsNotEmpty()
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
    public readonly repeat!: string;

    @IsString()
    @IsNotEmpty()
    public readonly categories!: string;

    @IsNumber()
    @IsNotEmpty()
    public readonly walletId!: number;

    @IsNumber()
    @IsNotEmpty()
    public readonly percentage!: number;

    @IsBoolean()
    @IsNotEmpty()
    public readonly active!: boolean;

    @IsOptional()
    @IsDateString()
    public readonly next_date!: Date
}