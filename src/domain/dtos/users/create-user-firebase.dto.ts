import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserFirebaseDto {

    @IsString()
    @IsNotEmpty()
    public readonly name!: string;

    @IsEmail()
    @IsNotEmpty()
    public readonly email!: string;

    @IsString()
    @IsNotEmpty()
    public password!: string;

    @IsString()
    @IsNotEmpty()
    public authProvider!: string;

    @IsBoolean()
    @IsNotEmpty()
    public emailValidated!: boolean;

    @IsBoolean()
    @IsNotEmpty()
    public email_sent!: boolean;

    // TODO: AGREGAR EL CAMPO AUTH-PROVIDER PARA SABER POR QUE MEDIO SE REGISTRO EL USUARIO
}