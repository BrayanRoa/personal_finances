import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
    public readonly balance!: number
}