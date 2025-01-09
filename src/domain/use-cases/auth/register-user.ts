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
            return user;
        }

        try {
            // Paso 2: Enviar correo
            await this.emailService.welcomeEmail(dto.email, dto.name, user.verificationCode);

            // Paso 3: Actualizar estado de email enviado
            await this.authRepository.updateUser(user.userId, { email_sent: true });

            return user.userId
        } catch (error) {
            // Registro del error en un sistema de logs
            console.error("Error sending email:", error); // Reemplazar con un sistema como Winston o Bunyan

            return new CustomResponse(`Failed to send verification email. Please try again later.`, 500);
        }
    }
}