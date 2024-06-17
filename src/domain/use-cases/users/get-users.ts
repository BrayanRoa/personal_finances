import { CustomResponse } from "../../../utils/response/custom.response";
import { UserEntity } from "../../entities/users/user.entity";
import { UserRepository } from "../../repositories/user.repository";

export interface GetUsersUseCase {
    execute(page: number, per_page: number): Promise<UserEntity[] | CustomResponse>;
}


export class GetUsers implements GetUsersUseCase {

    constructor(
        private repository: UserRepository
    ) { }
    execute(page: number, per_page: number): Promise<UserEntity[] | CustomResponse> {
        return this.repository.getAll(page, per_page)
    }
}