import { CustomResponse } from "../../utils/response/custom.response";
import { CreateUserDto } from "../dtos";
import { UpdateUserDto } from "../dtos/users/update-user.dto";
import { UserEntity } from "../entities/users/user.entity";

export abstract class UserDatasource {
    // ESTE CREATE ES MAS COMO PARA UN ADMINISTRADOR, PORQUE HAY UN REGISTRO EN EL MODULO DE AUTH
    abstract create(createUserDto: CreateUserDto, user_audits: string): Promise<UserEntity | CustomResponse>;
    abstract getAll(page: number, per_page: number): Promise<UserEntity[] | CustomResponse>;
    abstract findById(id: string): Promise<UserEntity | CustomResponse>;
    abstract update(id: string, updateUserDto: UpdateUserDto, user_audits: string): Promise<UserEntity | CustomResponse>;
    abstract delete(id: string, user_audits: string): Promise<UserEntity | CustomResponse>;

}