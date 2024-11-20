import { budgetInterface } from "../../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../../utils/response/custom.response";
import { DasbboardRepository } from "../../repositories/dashboard.repository";

export interface SummaryBudgetInformationUseCase {
    execute(page: number, per_page: number, userId: string): Promise<CustomResponse | budgetInterface>;
}

export class SummaryBudgetInformation implements SummaryBudgetInformationUseCase {
    constructor(
        private repository: DasbboardRepository,
    ) { }
    execute(page: number, per_page: number, userId: string): Promise<CustomResponse | budgetInterface> {
        return this.repository.summarybudgetsInformation(page, per_page, userId)
    }
}