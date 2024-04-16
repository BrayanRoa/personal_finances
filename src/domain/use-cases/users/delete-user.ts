import { CustomResponse } from "../../../utils/response/custom.response";
import { UserEntity } from "../../entities/users/user.entity";
import { UserRepository } from "../../repositories/user.repository";

export interface DeleteUserUseCase {
    execute(id: string, user_audits:string): Promise<UserEntity | undefined | CustomResponse>;
}


export class DeleteUser implements DeleteUserUseCase {

    constructor(
        private repository: UserRepository
    ) { }
    execute(id: string, user_audits:string): Promise<UserEntity | undefined | CustomResponse> {
        return this.repository.delete(id, user_audits)
    }
}