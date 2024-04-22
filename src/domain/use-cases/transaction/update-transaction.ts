import { CustomResponse } from "../../../utils/response/custom.response";
import { UpdateTransactionDto } from "../../dtos/transaction/update-transaction.dto";
import { TransactionRepository } from "../../repositories/transaction.repository";

export interface UpdateTransactionUseCase {
    execute(id: number, dto: UpdateTransactionDto, user_audits: string): Promise<string | CustomResponse>;
}


export class UpdateTransaction implements UpdateTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
    ) {
    }
    execute(id: number, dto: UpdateTransactionDto, user_audits: string): Promise<string | CustomResponse> {
        return this.repository.update(id, dto, user_audits)
    }
}