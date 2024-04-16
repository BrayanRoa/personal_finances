import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {

    @IsEmail()
    @IsNotEmpty()
    public readonly email!: string;

    @IsString()
    @IsNotEmpty()
    public readonly password!: string;

}