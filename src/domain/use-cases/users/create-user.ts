import { EmailService } from "../../../utils/emails/email.service";
import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateUserDto } from "../../dtos";
import { UserEntity } from "../../entities/users/user.entity";
import { UserRepository } from "../../repositories/user.repository";

export interface CreateUserUseCase {
    execute(dto: CreateUserDto, user_audits: string): Promise<UserEntity | string | CustomResponse>;
}


export class CreateUser implements CreateUserUseCase {

    constructor(
        private repository: UserRepository,
        private emailService: EmailService
    ) {
    }

    //TODO: ESTO NO DEBERIA FUNCIONA PORQUE CAMBIE LA FORMA COMO SE VERIFICA EL EMAIL, ESTE MODULO NO TIENE MUCHO SENTIDO EN ESTA APP
    async execute(dto: CreateUserDto, user_audits: string): Promise<UserEntity | string | CustomResponse> {
        const create = await this.repository.create(dto, user_audits)
        if (create instanceof CustomResponse) return create

        try {
            await this.emailService.welcomeEmail(dto.email, dto.name, "")
            await this.repository.update(create.id, { email_sent: true }, user_audits)
            return "User registered successfully, please verify your email address"
        } catch (error) {
            // TODO: AQUI DEBERIA ALMACENAR EN UN LOG Y NO MOSTRARLE AL USUARIO EL PROBLEMA
            return new CustomResponse(`mail could not be sent`, 500)
        }
    }
}