import { JwtAdapter } from "../../../utils/jwt/jwt";
import { CustomResponse } from "../../../utils/response/custom.response";
import { AuthRepository } from "../../repositories/auth.repository";
import { CategoryRepository } from "../../repositories/category.repository";

export interface ValidateEmailUseCase {
    execute(token: string): Promise<string | CustomResponse>;
}

export class ValidateEmail implements ValidateEmailUseCase {
    constructor(
        public authRepository: AuthRepository,
        private categoryRepository: CategoryRepository
    ) { }
    async execute(token: string): Promise<string | CustomResponse> {
        if (token === undefined) {
            throw new CustomResponse("Token must be provided on the request", 400)
        }
        const result = await JwtAdapter.decodeToken<{ id: string }>(token)
        if (!result) {
            throw new CustomResponse("Invalid token", 401)
        }
        const { id } = result
        const exist = await this.authRepository.getOneUser(id)

        if (exist instanceof CustomResponse) {
            return exist
        }
        await this.authRepository.updateUser(id, { emailValidated: true })
        this.categoryRepository.defaultCategories(id)
        return "Email successfully verified"
    }

}