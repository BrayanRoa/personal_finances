// import { prisma } from "../../database/postgres";
import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { CreateUserDto } from "../../domain/dtos";
import { CreateUserFirebaseDto } from "../../domain/dtos/users/create-user-firebase.dto";
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
    registerUser(data: CreateUserDto | CreateUserFirebaseDto): Promise<{ userId: string, verificationCode: string } | CustomResponse> {
        return this.handleErrors(async () => {
            // Paso 1: Verificar que el email no exista
            const exist = await BaseDatasource.prisma.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (exist) {
                return new CustomResponse("this email is already registered", 409);
            }
            // Paso 2: Generar y guardar la contraseña encriptada
            const new_user = await BaseDatasource.prisma.user.create({
                data,
            });
            // Paso 3: Generar y guardar el código de verificación
            if (data instanceof CreateUserDto) {
                const code = await this.generateAndSaveVerificationCode(new_user.id)
                if (code instanceof CustomResponse) {
                    return code
                }
                return {
                    userId: new_user.id,
                    verificationCode: code
                }
            } else {
                return {
                    userId: new_user.id,
                    verificationCode: ""
                }
            }
            // return UserEntity.fromObject(new_user);
        });
    }

    registerUserFirebase() {

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

    async generateAndSaveVerificationCode(serId: string): Promise<string | CustomResponse> {
        // Paso 3: Generar y guardar el código de verificación
        const plainCode = this.generateVerificationCode(); // Código separado en función

        // Paso 4: Obtener código de verificación activos
        const saveResult = await this.saveVerificationCode(serId, plainCode);
        if (saveResult instanceof CustomResponse) {
            return saveResult
        }
        return saveResult
    }

    async resendCode(userId: string): Promise<string | CustomResponse> {

        const getCodes = await this.getVerificationCode(userId)

        if (getCodes instanceof CustomResponse) {
            return getCodes
        }
        await this.updateVerificationCode(getCodes.id)
        const new_code = this.generateAndSaveVerificationCode(userId)

        return new_code
    }

    /**
     * Función para generar un código de verificación único
     * @returns Código de 4 dígitos como string
     */
    private generateVerificationCode(): string {
        let uniqueCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generación simple

        while (uniqueCode.length < 4) {
            Math.floor(1000 + Math.random() * 9000).toString();
        }

        return uniqueCode
    }
}
