import { JwtAdapter } from "../../../utils/jwt/jwt";
import { CustomResponse } from "../../../utils/response/custom.response";
import { UserEntity } from "../../entities/users/user.entity";
import { AuthRepository } from "../../repositories/auth.repository";


export interface loginResponse {
    token: string;
}

export interface LoginFirebaseUserUseCase {
    execute(userId: string): Promise<{ msg: string, token: string, name: string, email: string } | CustomResponse>;
}

export class LoginFirebaseUser implements LoginFirebaseUserUseCase {

    constructor(
        private authRepository: AuthRepository,
    ) { }

    async execute(userId: string): Promise<{ msg: string, token: string, name: string, email: string } | CustomResponse> {
        const user = await this.authRepository.getOneUser(userId, "LOGIN");
        if (user instanceof UserEntity) {

            const token = await JwtAdapter.generateToken({ id: user.id })
            if (!token) throw new CustomResponse("Error creating token", 500)

            if (!user.emailValidated) {
                return new CustomResponse("Email not validated", 403)
            }

            return {
                msg: "user logged successfully",
                name: user.name,
                email: user.email,
                token: token.toString(),
            }

        }
        return user
    }

}