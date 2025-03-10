import { FiltersTransaction } from "../../../utils/interfaces/filters-transactions.interface";
import { TransactionInterface } from "../../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../../utils/response/custom.response";
import { TransactionEntity } from "../../entities/transaction/transaction.entity";
import { TransactionRepository } from "../../repositories/transaction.repository";




export interface GetAllTransactionUseCase {
    // execute(userId: string, search: string, page: number, per_page: number, year: number, month: number, walletId: number, order: string, asc: string): Promise<TransactionInterface | CustomResponse>;

    execute(userId: string, search: string, page: number, per_page: number, filters: FiltersTransaction): Promise<TransactionInterface | CustomResponse>
}


export class GetAllTransaction implements GetAllTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
    ) {
    }
    execute(userId: string, search: string | undefined, page: number, per_page: number, filters: FiltersTransaction): Promise<TransactionInterface | CustomResponse> {
        return this.repository.getAllWithFilters(userId, search, page, per_page, filters)
    }
}