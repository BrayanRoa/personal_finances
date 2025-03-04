import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateWalletDto {
    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsNotEmpty()
    @IsString()
    public readonly userId!: string;

    @IsString()
    @IsOptional()
    public readonly description!: string

    @IsNumber()
    @IsOptional()
    public readonly initial_balance!: number

    @IsNumber()
    @IsOptional()
    public incomes?: number


    @IsString()
    @IsNotEmpty()
    @IsEnum([
        "CREDIT",
        "DEBIT",
    ])
    public readonly type_account!: string

}