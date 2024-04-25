import { UserDatasource } from "../../domain/datasources/user.datasource";
import { CreateUserDto } from "../../domain/dtos";
import { UpdateUserDto } from "../../domain/dtos/users/update-user.dto";
import { UserEntity } from "../../domain/entities/users/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { PasswordHasher } from "../../utils/passwordHasher/passwordHasher";
import { CustomResponse } from "../../utils/response/custom.response";

export class UserRepositoryImpl implements UserRepository {

    constructor(
        private readonly userDatasource: UserDatasource,
        private readonly passwordHasher: PasswordHasher
    ) { }
    async create(createUserDto: CreateUserDto, user_audits: string): Promise<UserEntity | CustomResponse> {
        const hashedPassword = await this.passwordHasher.hashPassword(createUserDto.password)
        createUserDto.password = hashedPassword
        return this.userDatasource.create(createUserDto, user_audits);
    }
    getAll(page: number, per_page: number): Promise<UserEntity[] | CustomResponse> {
        return this.userDatasource.getAll(page, per_page);
    }
    findById(id: string): Promise<UserEntity | CustomResponse> {
        return this.userDatasource.findById(id);
    }
    update(id: string, updateUserDto: UpdateUserDto, user_audits: string): Promise<string | CustomResponse> {
        return this.userDatasource.update(id, updateUserDto, user_audits);
    }
    delete(id: string, user_audits: string): Promise<string | CustomResponse> {
        return this.userDatasource.delete(id, user_audits);
    }

}