import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { CreateUserDto } from "../../domain/dtos";
import { UpdateUserDto } from "../../domain/dtos/users/update-user.dto";
import { UserEntity } from "../../domain/entities/users/user.entity";
import { VerificationCodeEntity } from "../../domain/entities/verification_code/verification-code";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { PasswordHasher } from "../../utils/passwordHasher/passwordHasher";
import { CustomResponse } from "../../utils/response/custom.response";

export class AuthRepositoryImpl implements AuthRepository {
    constructor(
        private authDatasource: AuthDatasource,
        private passwordHasher: PasswordHasher,
    ) { }
    resendCode(userId: string): Promise<string | CustomResponse> {
        return this.authDatasource.resendCode(userId)
    }
    updateVerificationCode(id: number): Promise<boolean | CustomResponse> {
        return this.authDatasource.updateVerificationCode(id)
    }
    getVerificationCode(userId: string): Promise<VerificationCodeEntity | CustomResponse> {
        return this.authDatasource.getVerificationCode(userId)
    }
    async saveVerificationCode(userId: string, code: string): Promise<string | CustomResponse> {
        // const hashedCode = await this.passwordHasher.hashPassword(code)
        return this.authDatasource.saveVerificationCode(userId, code)
    }
    updateUser(id: string, data: UpdateUserDto): Promise<boolean | CustomResponse> {
        return this.authDatasource.updateUSer(id, data)
    }
    getOneUser(param: string, type?: string): Promise<UserEntity | CustomResponse> {
        return this.authDatasource.findOneUser(param, type)
    }
    async registerUser(data: CreateUserDto): Promise<{ userId: string, verificationCode: string } | CustomResponse> {
        const hashedPassword = await this.passwordHasher.hashPassword(data.password)
        data.password = hashedPassword
        return this.authDatasource.registerUser(data);
    }


}