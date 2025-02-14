import { Request, Response } from "express";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { RegisterUser } from "../../domain/use-cases/auth/register-user";
import { CustomResponse } from "../../utils/response/custom.response";
import { LoginUser } from "../../domain/use-cases/auth/login-user";
import { ValidateEmail } from "../../domain/use-cases/auth/validate-email";
import { container } from "../../infraestructure/dependencies/container";
import { ResendCode } from "../../domain/use-cases/auth/resend-code";
import { LoginFirebaseUser } from "../../domain/use-cases/auth/login-firebase";
import { PasswordRecovery } from "../../domain/use-cases/auth/password-recovery";
import { PasswordReset } from "../../domain/use-cases/auth/reset-password";

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

    public loginFirebase = (req: Request, res: Response) => {
        const { userId } = req.body
        return new LoginFirebaseUser(this.authRepository)
            .execute(userId)
            .then(auth => CustomResponse.handleResponse(res, auth, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public registerFirebase = (req: Request, res: Response) => {
        // const { email, password } = req.body
        return new RegisterUser(this.authRepository, container.cradle.emailService, container.cradle.categoryRepository)
            .execute(req.body)
            .then(auth => CustomResponse.handleResponse(res, auth, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public register = async (req: Request, res: Response) => {
        return new RegisterUser(this.authRepository, container.cradle.emailService, container.cradle.categoryRepository)
            .execute(req.body)
            .then(auth => {
                CustomResponse.handleResponse(res, auth, 201)
            })
            .catch(err => {
                CustomResponse.handleResponse(res, err)
            });
    }

    public validateEmail = async (req: Request, res: Response) => {
        const { token, userId } = req.params;
        const { type } = req.query
        return new ValidateEmail(this.authRepository, container.cradle.categoryRepository)
            .execute(token, userId, type!.toString())
            .then(auth => CustomResponse.handleResponse(res, auth, 200))
            .catch(err => CustomResponse.handleResponse(res, err));
    }

    public resendCode = async (req: Request, res: Response) => {
        const { userId } = req.params
        return new ResendCode(this.authRepository, container.cradle.emailService)
            .execute(userId)
            .then(msg => CustomResponse.handleResponse(res, msg, 200))
            .catch(err => CustomResponse.handleResponse(res, err));
    }

    public sendPasswordResetCode = (req: Request, res: Response) => {
        const { email } = req.body
        return new PasswordRecovery(this.authRepository, container.cradle.emailService)
            .execute(email)
            .then(msg => CustomResponse.handleResponse(res, msg, 200))
            .catch(err => CustomResponse.handleResponse(res, err));
    }

    public passwordReset = (req: Request, res: Response) => {
        const { email, password } = req.body
        return new PasswordReset(this.authRepository, container.cradle.passwordHasher)
            .execute(email, password)
            .then(msg => CustomResponse.handleResponse(res, msg, 200))
            .catch(err => CustomResponse.handleResponse(res, err));
    }
}