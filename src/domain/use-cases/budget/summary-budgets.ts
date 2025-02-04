import { BudgetRepository } from "../../repositories/budget.repository";

export interface SummaryBudgetUseCase {
    execute(userId: string): Promise<any>
}

export class GetSummaryBudget implements SummaryBudgetUseCase {

    constructor(
        private repository: BudgetRepository,
    ) { }
    execute(userId: string): Promise<any> {
        return this.repository.summaryBudgets(userId)
    }

}