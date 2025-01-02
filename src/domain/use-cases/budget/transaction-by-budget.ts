import { TransactionInterface } from "../../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../../utils/response/custom.response";
import { ITransactionByBudget } from "../../interfaces/budgets/transaction-by-budget.interface";
import { BudgetRepository } from "../../repositories/budget.repository";

export interface TransactionByBudgetUseCase {
    execute(page: number, per_page: number, userID: string, categories: number[], startDate: string, endDate: string): Promise<CustomResponse | TransactionInterface>;
}


export class TransactionByBudget implements TransactionByBudgetUseCase {

    constructor(
        private repository: BudgetRepository,
    ) { }

    async execute(page: number, per_page: number, userID: string, categories: number[], startDate: string, endDate: string): Promise<CustomResponse | TransactionInterface> {
        console.log("USE", categories);
        const start = new Date(startDate)
        const end = new Date(endDate)
        return this.repository.transactionByBudget(1, 5, userID, categories, start, end)
    }

}