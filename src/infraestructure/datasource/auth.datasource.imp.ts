// import { prisma } from "../../database/postgres";
import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { CreateUserDto } from "../../domain/dtos";
import { UpdateUserDto } from "../../domain/dtos/users/update-user.dto";
import { UserEntity } from "../../domain/entities/users/user.entity";
import { VerificationCodeEntity } from "../../domain/entities/verification_code/verification-code";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";


export class AuthDatasourceImp extends BaseDatasource implements AuthDatasource {
    constructor() {
        super()
    }
    findOneUser(param: string, type?: string): Promise<UserEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const exist = await BaseDatasource.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: param },
                        { id: param }
                    ],
                    AND: [
                        { deleted_at: null },
                    ]
                },
            })
            return (exist)
                ? UserEntity.fromObject(exist)
                : new CustomResponse("email not found", 404);
        })
    }
    registerUser(data: CreateUserDto): Promise<UserEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const exist = await BaseDatasource.prisma.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (exist) {
                return new CustomResponse("email already exists", 409);
            }
            const new_user = await BaseDatasource.prisma.user.create({
                data,
            });
            return UserEntity.fromObject(new_user);
        });
    }

    updateUSer(id: string, data: UpdateUserDto): Promise<boolean | CustomResponse> {
        return this.handleErrors(async () => {
            await BaseDatasource.prisma.user.update({
                where: {
                    id
                },
                data: data
            });
            return true;
        })
    }

    saveVerificationCode(userId: string, code: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const expiredAt = new Date();
            expiredAt.setMinutes(expiredAt.getMinutes() + 10);

            const data = await BaseDatasource.prisma.verification_codes.create({
                data: {
                    code,
                    userId, // replace with user id
                    expired_at: expiredAt, // expires in 10 minutes
                    active: true
                }
            })

            return data.code
        })
    }

    getVerificationCode(userId: string): Promise<VerificationCodeEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const infoCode = await BaseDatasource.prisma.verification_codes.findFirst({
                where: {
                    active: true,
                    expired_at: { gt: new Date() },
                    userId
                }
            })
            if (!infoCode) return new CustomResponse("Invalid verification code", 401)
            return VerificationCodeEntity.fromObject(infoCode)
        })
    }

    updateVerificationCode(id: number): Promise<boolean | CustomResponse> {
        return this.handleErrors(async () => {
            await BaseDatasource.prisma.verification_codes.update({
                where: { id },
                data: { used: true, active: false }
            })
            return true
        })
    }
}
