import { BudgetDatasource } from "../../domain/datasources/budget.datasource";
import { CreateBudgetDto } from "../../domain/dtos/budget/create-budget.dto";
import { UpdateBudgetDto } from "../../domain/dtos/budget/update-budget.dto";
import { BudgetEntity } from "../../domain/entities/budget/budget.entity";
import { IGetAllBudgets } from "../../domain/interfaces/budgets/transaction-by-budget.interface";
import { BudgetRepository } from "../../domain/repositories/budget.repository";
import { TransactionInterface } from "../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../utils/response/custom.response";

export class BudgetRepositoryImp implements BudgetRepository {

    constructor(
        private readonly budgetDatasource: BudgetDatasource
    ) { }
    getManyBudgetCategory(budgetId: number): Promise<{ budgetId: number; categoryId: number; }[] | CustomResponse> {
        return this.budgetDatasource.getManyBudgetCategory(budgetId)
    }
    updateMany(data: UpdateBudgetDto[]): Promise<string | CustomResponse> {
        return this.budgetDatasource.updateMany(data)
    }
    updateAmounts(userId: string, data: UpdateBudgetDto, budgetId: number): Promise<boolean | CustomResponse> {
        return this.budgetDatasource.updateAmounts(userId, data, budgetId)
    }
    transactionByBudget(page: number, per_page: number, userId: string, categories: number[], startDate: Date, endDate: Date): Promise<CustomResponse | TransactionInterface> {
        return this.budgetDatasource.transactionByBudget(page, per_page, userId, categories, startDate, endDate)
    }
    getAllTransactionToBeDeactive(): Promise<BudgetEntity[] | CustomResponse> {
        return this.budgetDatasource.getAllTransactionToBeDeactive()
    }
    delete(id: number, userId: string): Promise<string | CustomResponse> {
        return this.budgetDatasource.delete(id, userId)
    }
    createMany(data: CreateBudgetDto[]): Promise<string | CustomResponse> {
        return this.budgetDatasource.createMany(data)
    }
    getAllRecurring(): Promise<CustomResponse | BudgetEntity[]> {
        return this.budgetDatasource.getAllRecurring()
    }
    update(id: number, data: UpdateBudgetDto): Promise<BudgetEntity | CustomResponse> {
        return this.budgetDatasource.update(id, data)
    }
    get_one_by_date(walletid: number, categoryid: number[], userid: string, date: Date): Promise<BudgetEntity[] | CustomResponse> {
        return this.budgetDatasource.get_one_by_date(walletid, categoryid, userid, date)
    }
    getOne(id: number, userId: string): Promise<BudgetEntity | CustomResponse> {
        return this.budgetDatasource.getOne(id, userId)
    }
    getAll(userId: string): Promise<IGetAllBudgets[] | CustomResponse> {
        return this.budgetDatasource.getAll(userId)
    }

    create(data: CreateBudgetDto): Promise<BudgetEntity | CustomResponse> {
        if (data instanceof Array) {
            data.forEach(element => {
                element.date = new Date(element.date)
                element.end_date = new Date(element.end_date)
            });
        } else {
            data.date = new Date(data.date)
            data.end_date = new Date(data.end_date)
        }
        return this.budgetDatasource.create(data)
    }

}