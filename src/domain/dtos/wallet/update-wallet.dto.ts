import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateWalletDto {
    @IsString()
    @IsNotEmpty()
    public name?: string;

    @IsString()
    @IsNotEmpty()
    public readonly userId?: string

    @IsString()
    @IsOptional()
    public readonly description?: string

    @IsNumber()
    @IsNotEmpty()
    public readonly balance?: number

    @IsBoolean()
    @IsOptional()
    public readonly main_account?: boolean

    @IsNumber()
    @IsOptional()
    public readonly initial_balance?: number

    @IsNumber()
    @IsOptional()
    public incomes?: number

    @IsBoolean()
    @IsOptional()
    public readonly expenses?: number
    
    @IsString()
    @IsNotEmpty()
    @IsEnum([
        "CREDIT",
        "DEBIT",
    ])
    public readonly type_account?: string

}