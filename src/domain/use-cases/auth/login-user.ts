import { JwtAdapter } from "../../../utils/jwt/jwt";
import { PasswordHasher } from "../../../utils/passwordHasher/passwordHasher";
import { CustomResponse } from "../../../utils/response/custom.response";
import { UserEntity } from "../../entities/users/user.entity";
import { AuthRepository } from "../../repositories/auth.repository";


export interface loginResponse {
    token: string;
}

export interface LoginUserUseCase {
    execute(email: string, password: string): Promise<{ msg: string, token: string } | CustomResponse>;
}

export class LoginUser implements LoginUserUseCase {

    constructor(
        private authRepository: AuthRepository,
        private passwordHasher: PasswordHasher
    ) { }

    async execute(email: string, password: string): Promise<{ msg: string, token: string, name: string } | CustomResponse> {
        const user = await this.authRepository.getOneUser(email, "LOGIN");
        if (user instanceof UserEntity) {
            const isMatch = await this.passwordHasher.verifyPassword(password, user.password!);
            if (!isMatch) {
                return new CustomResponse("Email or password invalid", 400);
            }
            const token = await JwtAdapter.generateToken({ id: user.id })
            if (!token) throw new CustomResponse("Error creating token", 500)

            if (!user.emailValidated) {
                return new CustomResponse("Email not validated", 403)
            }

            return {
                msg: "user logged successfully",
                name: `${user.name}`,
                token: token.toString(),
            }

        }
        return user
    }

}