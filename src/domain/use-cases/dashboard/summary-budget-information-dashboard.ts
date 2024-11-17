import { CustomResponse } from "../../../utils/response/custom.response";
import { BudgetDashboardEntity } from "../../entities/budget/budget-dashboard.entity";
import { DasbboardRepository } from "../../repositories/dashboard.repository";

export interface SummaryBudgetInformationUseCase {
    execute(userId: string): Promise<CustomResponse | BudgetDashboardEntity[]>;
}

export class SummaryBudgetInformation implements SummaryBudgetInformationUseCase {
    constructor(
        private repository: DasbboardRepository,
    ) { }
    execute(userId: string): Promise<CustomResponse | BudgetDashboardEntity[]> {
        return this.repository.summarybudgetsInformation(userId)
    }
}