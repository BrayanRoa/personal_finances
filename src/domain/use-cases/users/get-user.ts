import { CustomResponse } from "../../../utils/response/custom.response";
import { UserEntity } from "../../entities/users/user.entity";
import { UserRepository } from "../../repositories/user.repository";

export interface GetUserUseCase {
    execute(id: string): Promise<UserEntity | undefined | CustomResponse>;
}


export class GetUser implements GetUserUseCase {

    constructor(
        private repository: UserRepository
    ) { }
    execute(id: string): Promise<UserEntity | undefined | CustomResponse> {
        return this.repository.findById(id)
    }
}