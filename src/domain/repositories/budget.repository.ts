import { TransactionInterface } from "../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../utils/response/custom.response";
import { CreateBudgetDto } from "../dtos/budget/create-budget.dto";
import { UpdateBudgetDto } from "../dtos/budget/update-budget.dto";
import { BudgetEntity } from "../entities/budget/budget.entity";
import { IGetAllBudgets } from "../interfaces/budgets/transaction-by-budget.interface";

export abstract class BudgetRepository {

    abstract getAll(userId: string): Promise<IGetAllBudgets[] | CustomResponse>;
    abstract create(data: CreateBudgetDto): Promise<BudgetEntity | CustomResponse>;
    abstract createMany(data: CreateBudgetDto[] | CreateBudgetDto): Promise<string | CustomResponse>

    abstract getOne(id: number, userId: string): Promise<BudgetEntity | CustomResponse>
    abstract get_one_by_date(walletid: number, categoryid: number[], userid: string, date: Date): Promise<BudgetEntity[] | CustomResponse>

    abstract update(id: number, data: UpdateBudgetDto[] | UpdateBudgetDto): Promise<BudgetEntity | CustomResponse>

    abstract updateMany(data: UpdateBudgetDto[]): Promise<string | CustomResponse>

    abstract getAllRecurring(): Promise<CustomResponse | BudgetEntity[]>
    abstract delete(id: number, userId: string): Promise<string | CustomResponse>

    // method to obtain all budget that are currently expired
    abstract getAllTransactionToBeDeactive(): Promise<BudgetEntity[] | CustomResponse>

    abstract transactionByBudget(page: number, per_page: number, userId: string, categories: number[], startDate: Date, endDate: Date): Promise<CustomResponse | TransactionInterface>

    abstract updateAmounts(userId: string, data: UpdateBudgetDto, budgetId: number): Promise<boolean | CustomResponse>

    abstract getManyBudgetCategory(budgetId: number): Promise<{ budgetId: number, categoryId: number }[] | CustomResponse>

}