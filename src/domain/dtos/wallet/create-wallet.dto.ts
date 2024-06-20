import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
    @IsNotEmpty()
    public readonly balance!: number
}