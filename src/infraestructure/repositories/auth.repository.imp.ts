import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { CreateUserDto } from "../../domain/dtos";
import { UpdateUserDto } from "../../domain/dtos/users/update-user.dto";
import { UserEntity } from "../../domain/entities/users/user.entity";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { PasswordHasher } from "../../utils/passwordHasher/passwordHasher";
import { CustomResponse } from "../../utils/response/custom.response";

export class AuthRepositoryImpl implements AuthRepository {
    constructor(
        private datasource: AuthDatasource,
        private passwordHasher: PasswordHasher,
    ) { }
    updateUser(id: string, data: UpdateUserDto): Promise<boolean | CustomResponse> {
        return this.datasource.updateUSer(id, data)
    }
    getOneUser(param: string): Promise<UserEntity | CustomResponse> {
        return this.datasource.findOneUser(param)
    }
    async registerUser(user: CreateUserDto): Promise<UserEntity | CustomResponse> {  
        const hashedPassword = await this.passwordHasher.hashPassword(user.password)
        user.password = hashedPassword
        return this.datasource.registerUser(user);
    }
}