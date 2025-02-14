import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateUserDto } from "../../dtos";
import { CreateUserFirebaseDto } from "../../dtos/users/create-user-firebase.dto";
import { AuthRepository } from "../../repositories/auth.repository";
import { CategoryRepository } from "../../repositories/category.repository";
import { EmailService } from './../../../utils/emails/email.service';
export interface RegisterUserUseCase {
    execute(dto: CreateUserDto | CreateUserFirebaseDto): Promise<string | CustomResponse>;
}

export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private authRepository: AuthRepository,
        private emailService: EmailService,
        private categoryRepository: CategoryRepository,
    ) { }
    async execute(dto: CreateUserDto | CreateUserFirebaseDto): Promise<string | CustomResponse> {
        // Paso 1: Registrar el usuario
        const user = await this.authRepository.registerUser(dto);
        if (user instanceof CustomResponse) {
            return user;
        }
        if (user.verificationCode !== "") {

            try {
                // Paso 2: Enviar correo
                await this.emailService.welcomeEmail(dto.email, dto.name, user.verificationCode);

                // Paso 3: Actualizar estado de email enviado
                await this.authRepository.updateUser(user.userId, { email_sent: true });

            } catch (error) {
                // Registro del error en un sistema de logs
                console.error("Error sending email:", error); // Reemplazar con un sistema como Winston o Bunyan

                return new CustomResponse(`Failed to send verification email. Please try again later.`, 500);
            }
        } else {
            this.categoryRepository.defaultCategories(user.userId)
        }

        return user.userId
    }
}