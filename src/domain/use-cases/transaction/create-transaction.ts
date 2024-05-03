import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateTransactionDto } from "../../dtos/transaction/create-transaction.dto";
import { TransactionRepository } from "../../repositories/transaction.repository";

export interface CreateTransactionUseCase {
    execute(dto: CreateTransactionDto[] | CreateTransactionDto): Promise<string | CustomResponse>;
}


export class CreateTransaction implements CreateTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
    ) {
    }
    execute(dto: CreateTransactionDto[] | CreateTransactionDto): Promise<string | CustomResponse> {
        return this.repository.create(dto)
    }
}