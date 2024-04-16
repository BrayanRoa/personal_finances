import { IsNotEmpty, IsString } from "class-validator"


export class CreateAuditDTO {

    @IsNotEmpty()
    @IsString()
    public readonly id_class!: string
    
    @IsNotEmpty()
    @IsString()
    public readonly class_name!: string

    @IsNotEmpty()
    @IsString()
    public readonly data!: string
    
    @IsNotEmpty()
    @IsString()
    public readonly type!: string
    
    @IsNotEmpty()
    @IsString()
    public readonly user!: string

}