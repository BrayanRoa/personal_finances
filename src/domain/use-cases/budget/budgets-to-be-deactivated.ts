import { CustomResponse } from "../../../utils/response/custom.response";
import { BudgetEntity } from "../../entities/budget/budget.entity";
import { BudgetRepository } from "../../repositories/budget.repository";

export interface BudgetsToBeDeactivatedUseCase {
    execute(): Promise<BudgetEntity[] | CustomResponse>;
}


export class BudgetsToBeDeactivated implements BudgetsToBeDeactivatedUseCase {

    constructor(
        private repository: BudgetRepository,
    ) {
    }
    execute(): Promise<BudgetEntity[] | CustomResponse> {
        return this.repository.getAllTransactionToBeDeactive()
    }
}