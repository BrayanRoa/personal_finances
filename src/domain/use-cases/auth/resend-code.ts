import { EmailService } from "../../../utils/emails/email.service";
import { CustomResponse } from "../../../utils/response/custom.response";
import { AuthRepository } from "../../repositories/auth.repository";

export interface ResentCodeUseCase {
    execute(email: string): Promise<string | CustomResponse>;
}

export class ResendCode implements ResentCodeUseCase {

    constructor(
        private authRepository: AuthRepository,
        private emailService: EmailService
    ) { }

    async execute(email: string): Promise<string | CustomResponse> {
        const user = await this.authRepository.getOneUser(email);

        if (user instanceof CustomResponse) {
            return user;
        }

        const verificationCode = await this.authRepository.resendCode(user.id)

        if (verificationCode instanceof CustomResponse) {
            return verificationCode
        }
        // Paso 6: Enviar código de verificación al usuario
        await this.emailService.welcomeEmail(email, user.name, verificationCode);

        return user.id
    }
}