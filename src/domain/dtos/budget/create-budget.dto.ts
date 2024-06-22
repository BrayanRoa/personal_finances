import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateBudgetDto {

    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsString()
    @IsOptional()
    public description!: string;

    @IsNotEmpty()
    @IsDateString()
    public initial_date!: Date;

    @IsNotEmpty()
    @IsDateString()
    public end_date!: Date;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    public readonly amount!: number;

    @IsString()
    @IsNotEmpty()
    public readonly userId!: string
}