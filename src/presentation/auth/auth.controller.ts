import { Request, Response } from "express";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { RegisterUser } from "../../domain/use-cases/auth/register-user";
import { CustomResponse } from "../../utils/response/custom.response";
import { LoginUser } from "../../domain/use-cases/auth/login-user";
import { ValidateEmail } from "../../domain/use-cases/auth/validate-email";
import { container } from "../../infraestructure/dependencies/container";

export class AuthController {
    constructor(
        private readonly authRepository: AuthRepository,
    ) { }

    public login = async (req: Request, res: Response) => {
        const { email, password } = req.body
        return new LoginUser(this.authRepository, container.cradle.passwordHasher)
            .execute(email, password)
            .then(auth => CustomResponse.handleResponse(res, auth, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public register = async (req: Request, res: Response) => {
        // const emailService = new EmailService(envs.MAILER_SERVICE, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY)
        new RegisterUser(this.authRepository, container.cradle.emailService)
            .execute(req.body)
            .then(auth => CustomResponse.handleResponse(res, auth, 201))
            .catch(err => CustomResponse.handleResponse(res, err));
    }

    public validateEmail = async (req: Request, res: Response) => {
        const { token } = req.params;
        new ValidateEmail(this.authRepository, container.cradle.categoryRepository)
            .execute(token)
            .then(auth => CustomResponse.handleResponse(res, auth, 200))
            .catch(err => CustomResponse.handleResponse(res, err));
    }
}