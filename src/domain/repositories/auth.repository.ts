import { CustomResponse } from "../../utils/response/custom.response";
import { CreateUserDto } from "../dtos";
import { UpdateUserDto } from "../dtos/users/update-user.dto";
import { UserEntity } from "../entities/users/user.entity";


export abstract class AuthRepository {

    abstract registerUser(user: CreateUserDto): Promise<UserEntity | CustomResponse>;
    abstract getOneUser(param: string): Promise<UserEntity | CustomResponse>;
    abstract updateUser(id:string, data:UpdateUserDto):Promise<boolean | CustomResponse>

}