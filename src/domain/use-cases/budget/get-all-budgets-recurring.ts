import { CustomResponse } from "../../../utils/response/custom.response";
import { BudgetEntity } from "../../entities/budget/budget.entity";
import { BudgetRepository } from "../../repositories/budget.repository";

export interface GetAllBudgetsUseCase {
    execute(): Promise<BudgetEntity[] | CustomResponse>;
}


export class GetAllBudgetsRecurring implements GetAllBudgetsUseCase {

    constructor(
        private repository: BudgetRepository,
    ) {
    }
    execute(): Promise<BudgetEntity[] | CustomResponse> {
        return this.repository.getAllRecurring()
    }
}