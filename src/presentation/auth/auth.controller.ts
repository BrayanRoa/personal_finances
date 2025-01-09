import { Request, Response } from "express";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { RegisterUser } from "../../domain/use-cases/auth/register-user";
import { CustomResponse } from "../../utils/response/custom.response";
import { LoginUser } from "../../domain/use-cases/auth/login-user";
import { ValidateEmail } from "../../domain/use-cases/auth/validate-email";
import { container } from "../../infraestructure/dependencies/container";
import { ResendCode } from "../../domain/use-cases/auth/resend-code";

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
        new RegisterUser(this.authRepository, container.cradle.emailService)
            .execute(req.body)
            .then(auth => {
                console.log({ auth });
                CustomResponse.handleResponse(res, auth, 201)
            })
            .catch(err => {
                console.log("soy el error", err);
                CustomResponse.handleResponse(res, err)
            });
    }

    public validateEmail = async (req: Request, res: Response) => {
        const { token, userId } = req.params;
        new ValidateEmail(this.authRepository, container.cradle.categoryRepository, container.cradle.passwordHasher)
            .execute(token, userId)
            .then(auth => CustomResponse.handleResponse(res, auth, 200))
            .catch(err => CustomResponse.handleResponse(res, err));
    }

    public resendCode = async (req: Request, res: Response) => {
        const { userId } = req.params
        console.log({userId});
        new ResendCode(this.authRepository, container.cradle.emailService)
            .execute(userId)
            .then(msg => CustomResponse.handleResponse(res, msg, 200))
            .catch(err => CustomResponse.handleResponse(res, err));
    }
}