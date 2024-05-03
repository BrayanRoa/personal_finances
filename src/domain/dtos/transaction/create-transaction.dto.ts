import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {

    @IsNotEmpty()
    @IsDateString()
    public date!: Date;

    @IsNotEmpty()
    @IsNumber()
    public readonly amount!: number;

    @IsNotEmpty()
    @IsString()
    public description!: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(["INCOME", "OUTFLOW"])
    public readonly type!: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum([
        "NEVER",
        "EVERY DAY",
        "EVERY TWO DAYS",
        "EVERY WORKING DAY",
        "EVERY WEEK",
        "EVERY TWO WEEKS",
        "EVERY MONTH",
        "EVERY TWO MONTHS",
        "EVERY THREE MONTHS",
        "EVERY SIX MONTHS",
        "EVERY YEAR"
    ])
    public readonly repeat!: string;

    @IsNotEmpty()
    @IsString()
    public readonly userId!: string;

    @IsNotEmpty()
    @IsInt()
    public readonly walletId!: number;

    @IsNotEmpty()
    @IsInt()
    public categoryId!: number;

    @IsBoolean()
    @IsNotEmpty()
    active!: boolean;

    @IsOptional()
    @IsDateString()
    next_date!: Date

}