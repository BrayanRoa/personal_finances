import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    @IsOptional()
    public readonly name?: string;

    @IsEmail()
    @IsOptional()
    public readonly email?: string;

    @IsString()
    @IsOptional()
    public readonly password?: string;

    @IsOptional()
    @IsBoolean()
    public readonly emailValidated?: boolean;

    @IsOptional()
    @IsBoolean()
    public readonly email_sent?: boolean;

}