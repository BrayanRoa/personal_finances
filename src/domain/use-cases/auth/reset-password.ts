import { PasswordHasher } from "../../../utils/passwordHasher/passwordHasher";
import { CustomResponse } from "../../../utils/response/custom.response";
import { AuthRepository } from "../../repositories/auth.repository";

export interface PasswordResetUseCase {
    execute(email: string, newPassword: string): Promise<boolean | CustomResponse>;
}


export class PasswordReset implements PasswordResetUseCase {

    constructor(
        private auth: AuthRepository,
        private passwordHasher: PasswordHasher,
    ) { }

    async execute(email: string, newPassword: string): Promise<boolean | CustomResponse> {
        const exist = await this.auth.getOneUser(email)

        if (exist instanceof CustomResponse) {
            return exist
        }

        const hashedPassword = await this.passwordHasher.hashPassword(newPassword)
        newPassword = hashedPassword

        const update = await this.auth.updateUser(exist.id, { password: newPassword })

        if (update instanceof CustomResponse) {
            return update
        }
        
        return true
    }

}