import { FiltersTransaction } from '../../utils/interfaces/filters-transactions.interface';
import { TransactionInterface } from '../../utils/interfaces/response_paginate';
import { CustomResponse } from '../../utils/response/custom.response';
import { UpdateTransactionDto } from '../dtos/transaction/update-transaction.dto';
import { BudgetTransactionEntity } from '../entities/budget/budget-transactions.entity';
import { TransactionEntity } from '../entities/transaction/transaction.entity';
import { CreateTransactionDto } from './../dtos/transaction/create-transaction.dto';

export abstract class TransactionDatasource {

    abstract create(data: CreateTransactionDto[] | CreateTransactionDto): Promise<string | TransactionEntity | CustomResponse>
    // abstract getAll(userId: string, search: string | undefined, page: number, per_page: number, year: number, month: number, walletId: number, order: string, asc: string): Promise<TransactionInterface | CustomResponse>
    abstract getAllWithFilters(userId: string, search: string | undefined, page: number, per_page: number, filters: FiltersTransaction): Promise<TransactionInterface | CustomResponse>
    abstract findById(id: number, userId: string): Promise<TransactionEntity | CustomResponse>
    abstract delete(id: number, user_audits: string): Promise<string | CustomResponse>
    abstract update(id: number, data: UpdateTransactionDto[] | UpdateTransactionDto): Promise<TransactionEntity | string | CustomResponse>
    abstract getAllRecurring(): Promise<CustomResponse | TransactionEntity[]>
    abstract transactionWithCategories(idCategory: number, userId: string): Promise<CustomResponse | boolean>
    abstract getYears(user_audits: string): Promise<CustomResponse | number[]>
    abstract createTransactionBudget(idBudget: number, idTransaction: number): Promise<boolean | CustomResponse>
    abstract transactionByDate(userId: string, start_date: Date, end_date: Date, categoryId: number): Promise<TransactionEntity[] | CustomResponse>

    abstract markBudgetTransactionAsDeleted(budgetId: number, transactionId: number): Promise<boolean | CustomResponse>

    abstract getAllTransactionBudget(transactionId: number): Promise<BudgetTransactionEntity[] | CustomResponse>

}