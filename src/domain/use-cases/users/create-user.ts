import { EmailService } from "../../../utils/emails/email.service";
import { CustomResponse } from "../../../utils/response/custom.response";
import { BaseUseCase } from "../../../utils/use-case/base.use-case";
import { CreateUserDto } from "../../dtos";
import { UserEntity } from "../../entities/users/user.entity";
import { UserRepository } from "../../repositories/user.repository";

export interface CreateUserUseCase {
    execute(dto: CreateUserDto, user_audits:string): Promise<UserEntity | string | CustomResponse>;
}


export class CreateUser implements CreateUserUseCase {

    constructor(
        private repository: UserRepository,
        private emailService: EmailService
    ) {
    }
    async execute(dto: CreateUserDto, user_audits:string): Promise<UserEntity | string | CustomResponse> {
        const create = await this.repository.create(dto, user_audits)
        if (create instanceof CustomResponse) return create

        try {
            await this.emailService.welcomeEmail(create.id, dto.email)
            await this.repository.update(create.id, { email_sent: true }, user_audits)
            return "User registered successfully, please verify your email address"
        } catch (error) {
            return new CustomResponse(`mail could not be sent`, 500)
            // TODO: AQUI DEBERIA ALMACENAR EN UN LOG Y NO MOSTRARLE AL USUARIO EL PROBLEMA
        }
    }
}