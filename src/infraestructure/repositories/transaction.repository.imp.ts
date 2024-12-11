import { TransactionDatasource } from "../../domain/datasources/transaction.datasource";
import { CreateTransactionDto } from "../../domain/dtos/transaction/create-transaction.dto";
import { UpdateTransactionDto } from "../../domain/dtos/transaction/update-transaction.dto";
import { TransactionEntity } from "../../domain/entities/transaction/transaction.entity";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { FiltersTransaction } from "../../utils/interfaces/filters-transactions.interface";
import { TransactionInterface } from "../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../utils/response/custom.response";

export class TransactionRepositoryImp extends TransactionRepository {

    constructor(
        private readonly transactionDatasource: TransactionDatasource
    ) {
        super()
    }
    transactionWithCategories(idCategory: number, userId: string): Promise<CustomResponse | boolean> {
        return this.transactionDatasource.transactionWithCategories(idCategory, userId)
    }
    getAllRecurring(): Promise<CustomResponse | TransactionEntity[]> {
        return this.transactionDatasource.getAllRecurring()
    }
    create(data: CreateTransactionDto[] | CreateTransactionDto): Promise<string | CustomResponse> {
        if (data instanceof Array) {
            data.forEach(element => {
                element.date = new Date(element.date)
            });
        } else {
            data.date = new Date(data.date)
        }
        return this.transactionDatasource.create(data)
    }
    // getAll(userId: string, search: string | undefined, page: number, per_page: number, year: number, month: number, walletId: number, order: string, asc: string): Promise<CustomResponse | TransactionInterface> {
    //     return this.transactionDatasource.getAll(userId, search, page, per_page, year, month, walletId, order, asc)
    // }

    getAllWithFilters(userId: string, search: string | undefined, page: number, per_page: number, filters: FiltersTransaction): Promise<TransactionInterface | CustomResponse> {
        return this.transactionDatasource.getAllWithFilters(userId, search, page, per_page, filters)
    }
    findById(id: number, userId: string): Promise<CustomResponse | TransactionEntity> {
        return this.transactionDatasource.findById(id, userId)
    }
    delete(id: number, user_audits: string): Promise<string | CustomResponse> {
        return this.transactionDatasource.delete(id, user_audits);
    }

    update(id: number, data: UpdateTransactionDto[] | UpdateTransactionDto): Promise<{ action: string, amountDifference: number } | string | CustomResponse> {
        if (!(data instanceof Array)) { // aqui pregunto si no es un array
            data.date = new Date(data.date!)
        }
        return this.transactionDatasource.update(id, data,)
    }

    getYears(user_audits: string): Promise<CustomResponse | number[]> {
        return this.transactionDatasource.getYears(user_audits)
    }

}