import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {

    @IsString()
    @IsNotEmpty()
    public message!: string;

    @IsString()
    @IsNotEmpty()
    public title!: string;

    @IsNotEmpty()
    @IsBoolean()
    public read!: boolean;

    @IsString()
    @IsNotEmpty()
    public readonly userId!: string

}