import { CustomResponse } from "../../../utils/response/custom.response";
import { TransactionEntity } from "../../entities/transaction/transaction.entity";
import { TransactionRepository } from "../../repositories/transaction.repository";

export interface GetAllTransactionUseCase {
    execute(): Promise<TransactionEntity[] | CustomResponse>;
}


export class GetAllTransactionRecurring implements GetAllTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
    ) {
    }
    execute(): Promise<TransactionEntity[] | CustomResponse> {
        return this.repository.getAllRecurring()
    }
}