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
        // Paso 1: Generar codigo de cuatro digitos
        const plainCode = this.generateVerificationCode(); // Código separado en función

        // Paso 3: Obtener código de verificación activos
        const getCodes = await this.authRepository.getVerificationCode(user.id)

        if (getCodes instanceof CustomResponse) {
            return getCodes
        }

        // Paso 4: Actualizar el código de verificación activo
        await this.authRepository.updateVerificationCode(getCodes.id)

        // Paso 5: Generar y guardar el código de verificación
        const saveResult = await this.authRepository.saveVerificationCode(user.id, plainCode)

        if (saveResult instanceof CustomResponse) {
            return saveResult;
        }

        // Paso 6: Enviar código de verificación al usuario
        await this.emailService.welcomeEmail(email, user.name, plainCode);

        return user.id
    }

    private generateVerificationCode(): string {
        let uniqueCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generación simple

        while (uniqueCode.length < 4) {
            Math.floor(1000 + Math.random() * 9000).toString();
        }

        return uniqueCode
    }
}