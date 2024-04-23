import { CustomResponse } from "../../../utils/response/custom.response";
import { UpdateUserDto } from "../../dtos/users/update-user.dto";
import { UserRepository } from "../../repositories/user.repository";

export interface UpdateUserUseCase {
    execute(id: string, dto: UpdateUserDto, user_audits: string): Promise<string | CustomResponse>;
}

export class UpdateUser implements UpdateUserUseCase {

    constructor(
        private repository: UserRepository
    ) { }
    execute(id: string, dto: UpdateUserDto, user_audits: string): Promise<string | CustomResponse> {
        return this.repository.update(id, dto, user_audits)
    }
}