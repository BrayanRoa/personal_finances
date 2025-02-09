import { CustomResponse } from "../../utils/response/custom.response";
import { CreateUserDto } from "../dtos";
import { CreateUserFirebaseDto } from "../dtos/users/create-user-firebase.dto";
import { UpdateUserDto } from "../dtos/users/update-user.dto";
import { UserEntity } from "../entities/users/user.entity";
import { VerificationCodeEntity } from "../entities/verification_code/verification-code";


export abstract class AuthRepository {

    abstract registerUser(data: CreateUserDto | CreateUserFirebaseDto): Promise<{ userId: string, verificationCode: string } | CustomResponse>;
    abstract getOneUser(param: string, type?: string): Promise<UserEntity | CustomResponse>;
    abstract updateUser(id: string, data: UpdateUserDto): Promise<boolean | CustomResponse>

    abstract saveVerificationCode(userId: string, code: string): Promise<string | CustomResponse>

    abstract getVerificationCode(userId: string): Promise<VerificationCodeEntity | CustomResponse>

    abstract updateVerificationCode(id: number): Promise<boolean | CustomResponse>

    abstract resendCode(userId: string): Promise<string | CustomResponse>

}