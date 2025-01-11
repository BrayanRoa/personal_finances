import { JwtAdapter } from "../../../utils/jwt/jwt";
import { PasswordHasher } from "../../../utils/passwordHasher/passwordHasher";
import { CustomResponse } from "../../../utils/response/custom.response";
import { AuthRepository } from "../../repositories/auth.repository";
import { CategoryRepository } from "../../repositories/category.repository";

export interface ValidateEmailUseCase {
    execute(token: string, userId: string): Promise<string | CustomResponse>;
}

export class ValidateEmail implements ValidateEmailUseCase {
    constructor(
        public authRepository: AuthRepository,
        private categoryRepository: CategoryRepository,
        private passwordHasher: PasswordHasher
    ) { }
    async execute(token: string, userId: string): Promise<string | CustomResponse> {
        if (token === undefined) {
            throw new CustomResponse("Token must be provided on the request", 400)
        }
        // const result = await JwtAdapter.decodeToken<{ id: string }>(token)
        // if (!result) {
        //     throw new CustomResponse("Invalid token", 401)
        // }
        // const { id } = result
        const exist = await this.authRepository.getOneUser(userId)

        if (exist instanceof CustomResponse) {
            return exist
        }

        const verificarionCode = await this.authRepository.getVerificationCode(userId)
        if (verificarionCode instanceof CustomResponse) {
            throw new CustomResponse("Verification code not found", 404)
        }

        if (verificarionCode.code !== token) {
            throw new CustomResponse("Invalid verification code", 400)
        }
        await this.authRepository.updateVerificationCode(verificarionCode.id)

        await this.authRepository.updateUser(userId, { emailValidated: true })
        this.categoryRepository.defaultCategories(userId)
        return "Email successfully verified"
    }


}