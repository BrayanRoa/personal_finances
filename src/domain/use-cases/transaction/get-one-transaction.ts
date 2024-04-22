import { CustomResponse } from "../../../utils/response/custom.response";
import { TransactionEntity } from "../../entities/transaction/transaction.entity";
import { TransactionRepository } from "../../repositories/transaction.repository";

export interface GetOneTransactionUseCase {
    execute(id: number, userId: string): Promise<TransactionEntity | CustomResponse>;
}

export class GetOneTransactiona implements GetOneTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
    ) { }
    execute(id: number, userId: string): Promise<TransactionEntity | CustomResponse> {
        return this.repository.findById(id, userId);
    }

}