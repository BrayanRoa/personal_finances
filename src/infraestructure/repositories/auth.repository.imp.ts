import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { CreateUserDto } from "../../domain/dtos";
import { UpdateUserDto } from "../../domain/dtos/users/update-user.dto";
import { UserEntity } from "../../domain/entities/users/user.entity";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { PasswordHasher } from "../../utils/passwordHasher/passwordHasher";
import { CustomResponse } from "../../utils/response/custom.response";

export class AuthRepositoryImpl implements AuthRepository {
    constructor(
        private authDatasource: AuthDatasource,
        private passwordHasher: PasswordHasher,
    ) { }
    updateUser(id: string, data: UpdateUserDto): Promise<boolean | CustomResponse> {
        return this.authDatasource.updateUSer(id, data)
    }
    getOneUser(param: string, type?: string): Promise<UserEntity | CustomResponse> {
        return this.authDatasource.findOneUser(param, type)
    }
    async registerUser(data: CreateUserDto): Promise<UserEntity | CustomResponse> {
        const hashedPassword = await this.passwordHasher.hashPassword(data.password)
        data.password = hashedPassword
        return this.authDatasource.registerUser(data);
    }
}