import { TransactionInterface } from "../../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../../utils/response/custom.response";
import { TransactionEntity } from "../../entities/transaction/transaction.entity";
import { TransactionRepository } from "../../repositories/transaction.repository";

export interface GetAllTransactionUseCase {
    execute(userId: string, search: string, page: number, per_page: number): Promise<TransactionInterface | CustomResponse>;
}


export class GetAllTransaction implements GetAllTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
    ) {
    }
    execute(userId: string, search: string | undefined, page: number, per_page: number): Promise<TransactionInterface | CustomResponse> {
        return this.repository.getAll(userId, search, page, per_page)
    }
}