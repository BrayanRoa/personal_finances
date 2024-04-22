import { CustomResponse } from "../../../utils/response/custom.response";
import { TransactionRepository } from "../../repositories/transaction.repository";

export interface DeleteTransactionUseCase {
    execute(id: number, user_audits: string): Promise<string | CustomResponse>;
}


export class DeleteTransaction implements DeleteTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
    ) {
    }
    execute(id: number, user_audits: string): Promise<string | CustomResponse> {
        return this.repository.delete(id, user_audits)
    }
}