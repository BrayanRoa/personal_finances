import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateUserDto } from "../../dtos";
import { AuthRepository } from "../../repositories/auth.repository";
import { EmailService } from './../../../utils/emails/email.service';
export interface RegisterUserUseCase {
    execute(dto: CreateUserDto): Promise<string | CustomResponse>;
}

export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private authRepository: AuthRepository,
        private emailService: EmailService
    ) { }
    async execute(dto: CreateUserDto): Promise<string | CustomResponse> {
        // Paso 1: Registrar el usuario
        const user = await this.authRepository.registerUser(dto);
        if (user instanceof CustomResponse) {
            console.log({user});
            return user;
        }

        try {
            // Paso 2: Generar y guardar el código de verificación
            const plainCode = this.generateVerificationCode(); // Código separado en función
            const saveResult = await this.authRepository.saveVerificationCode(user.id, plainCode);

            if (saveResult instanceof CustomResponse) {
                return saveResult;
            }

            // Paso 3: Enviar correo
            await this.emailService.welcomeEmail(dto.email, dto.name, plainCode);

            // Paso 4: Actualizar estado de email enviado
            await this.authRepository.updateUser(user.id, { email_sent: true });

            return user.id
        } catch (error) {
            // Registro del error en un sistema de logs
            console.error("Error sending email:", error); // Reemplazar con un sistema como Winston o Bunyan

            return new CustomResponse(`Failed to send verification email. Please try again later.`, 500);
        }
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