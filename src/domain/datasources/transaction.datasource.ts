import { TransactionInterface } from '../../utils/interfaces/response_paginate';
import { CustomResponse } from '../../utils/response/custom.response';
import { UpdateTransactionDto } from '../dtos/transaction/update-transaction.dto';
import { TransactionEntity } from '../entities/transaction/transaction.entity';
import { CreateTransactionDto } from './../dtos/transaction/create-transaction.dto';

export abstract class TransactionDatasource {

    abstract create(data: CreateTransactionDto[] | CreateTransactionDto): Promise<string | CustomResponse>
    abstract getAll(userId: string, search: string|undefined, page:number, per_page:number): Promise<TransactionInterface | CustomResponse>
    abstract findById(id: number, userId: string): Promise<TransactionEntity | CustomResponse>
    abstract delete(id: number, user_audits: string): Promise<string | CustomResponse>
    abstract update(id: number, data: UpdateTransactionDto[] | UpdateTransactionDto): Promise<{ action: string, amountDifference: number } | string | CustomResponse>
    abstract getAllRecurring(): Promise<CustomResponse | TransactionEntity[]>
    abstract transactionWithCategories(idCategory: number, userId: string): Promise<CustomResponse | boolean>
}