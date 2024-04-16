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

    async execute(email: string, password: string): Promise<{ msg: string, token: string } | CustomResponse> {
        const user = await this.authRepository.getOneUser(email);
        if (user instanceof UserEntity) {
            const isMatch = await this.passwordHasher.verifyPassword(password, user.password!);
            if (isMatch) {
                const token = await JwtAdapter.generateToken({ id: user.id })
                if (!token) throw new CustomResponse("Error creating token", 500)
                return {
                    msg: "user logged successfully",
                    token: token.toString(),
                }
            } else {
                return new CustomResponse("invalid password", 400);
            }
        }
        return user
    }

}