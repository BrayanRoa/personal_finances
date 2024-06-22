import { CustomResponse } from "../../../utils/response/custom.response";
import { BudgetEntity } from "../../entities/budget/budget.entity";
import { BudgetRepository } from "../../repositories/budget.repository";

export interface GetAllBudgetUseCase {
    execute(userId: string): Promise<BudgetEntity[] | CustomResponse>;
}


export class GetAllBudgets implements GetAllBudgetUseCase {

    constructor(
        private readonly repository: BudgetRepository
    ) { }
    execute(userId: string): Promise<CustomResponse | BudgetEntity[]> {
        return this.repository.getAll(userId)
    }

}