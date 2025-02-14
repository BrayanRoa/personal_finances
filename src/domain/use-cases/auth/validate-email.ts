import { JwtAdapter } from "../../../utils/jwt/jwt";
import { PasswordHasher } from "../../../utils/passwordHasher/passwordHasher";
import { CustomResponse } from "../../../utils/response/custom.response";
import { AuthRepository } from "../../repositories/auth.repository";
import { CategoryRepository } from "../../repositories/category.repository";

export interface ValidateEmailUseCase {
    execute(token: string, userId: string, action: string): Promise<string | CustomResponse>;
}

export class ValidateEmail implements ValidateEmailUseCase {
    constructor(
        public authRepository: AuthRepository,
        private categoryRepository: CategoryRepository,
    ) { }

    // con este parametro "type" valido si se esta verificando la creacion de un usuario o el cambio de contraseña
    async execute(token: string, userId: string, type: string): Promise<string | CustomResponse> {
        if (token === undefined) {
            throw new CustomResponse("Token must be provided on the request", 400)
        }

        const exist = await this.authRepository.getOneUser(userId)

        if (exist instanceof CustomResponse) {
            return exist
        }
        const verificarionCode = await this.authRepository.getVerificationCode(exist.id)
        if (verificarionCode instanceof CustomResponse) {
            throw new CustomResponse("Verification code not found", 404)
        }

        if (verificarionCode.code !== token) {
            throw new CustomResponse("Invalid verification code", 400)
        }
        await this.authRepository.updateVerificationCode(verificarionCode.id)

        if (type === "register") {
            this.categoryRepository.defaultCategories(exist.id)
        }

        await this.authRepository.updateUser(exist.id, { emailValidated: true })
        return "Email successfully verified"
    }


}