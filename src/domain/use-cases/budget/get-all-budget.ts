import { CustomResponse } from "../../../utils/response/custom.response";
import { BudgetEntity } from "../../entities/budget/budget.entity";
import { IGetAllBudgets } from "../../interfaces/budgets/transaction-by-budget.interface";
import { BudgetRepository } from "../../repositories/budget.repository";

export interface GetAllBudgetUseCase {
    execute(userId: string): Promise<IGetAllBudgets[] | CustomResponse>;
}


export class GetAllBudgets implements GetAllBudgetUseCase {

    constructor(
        private readonly repository: BudgetRepository
    ) { }
    async execute(userId: string): Promise<CustomResponse | IGetAllBudgets[]> {
        return this.repository.getAll(userId)
    }

}