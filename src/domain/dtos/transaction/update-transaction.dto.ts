import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTransactionDto {

    @IsOptional()
    @IsNumber()
    id?:number

    @IsOptional()
    @IsDateString()
    public date?: Date;

    @IsOptional()
    @IsNumber()
    public readonly amount?: number;

    @IsOptional()
    @IsString()
    public description?: string;

    @IsString()
    @IsOptional()
    public name?:string;

    @IsOptional()
    @IsString()
    @IsEnum(["INCOME", "OUTFLOW"])
    public readonly type?: string;

    @IsOptional()
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
        "EVERY YEAR",
    ])
    public readonly repeat?: string;

    @IsNotEmpty()
    @IsString()
    public readonly userId!: string;

    @IsOptional()
    @IsInt()
    public readonly walletId?: number;

    @IsOptional()
    @IsInt()
    public categoryId?: number;

    @IsBoolean()
    @IsOptional()
    active?: boolean;

    @IsOptional()
    @IsDateString()
    next_date!: Date | null;
}