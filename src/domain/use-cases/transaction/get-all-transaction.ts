import { CustomResponse } from "../../../utils/response/custom.response";
import { TransactionEntity } from "../../entities/transaction/transaction.entity";
import { TransactionRepository } from "../../repositories/transaction.repository";

export interface GetAllTransactionUseCase {
    execute(userId: string): Promise<TransactionEntity[] | CustomResponse>;
}


export class GetAllTransaction implements GetAllTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
    ) {
    }
    execute(userId: string): Promise<TransactionEntity[] | CustomResponse> {
        return this.repository.getAll(userId)
    }
}