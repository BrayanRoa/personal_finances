import { EmailService } from "../../../utils/emails/email.service";
import { CustomResponse } from "../../../utils/response/custom.response";
import { AuthRepository } from "../../repositories/auth.repository";

export interface PasswordRecoveryUseCase {
    execute(email: string): Promise<string | CustomResponse>;
}


export class PasswordRecovery implements PasswordRecoveryUseCase {

    constructor(
        private AuthRepository: AuthRepository,
        private emailService: EmailService
    ) { }
    async execute(email: string): Promise<string | CustomResponse> {
        const user = await this.AuthRepository.getOneUser(email);

        if (user instanceof CustomResponse) {
            return user;
        }

        const code = this.generateVerificationCode()

        await this.AuthRepository.saveVerificationCode(user.id, code)

        await this.emailService.welcomeEmail(user.email, user.name, code);

        return `Verify your email: ${user.email}`
    }

    private generateVerificationCode(): string {
        let uniqueCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generación simple

        while (uniqueCode.length < 4) {
            Math.floor(1000 + Math.random() * 9000).toString();
        }

        return uniqueCode
    }

}