import { CustomResponse } from "../../../utils/response/custom.response";
import { UpdateBudgetDto } from "../../dtos/budget/update-budget.dto";
import { BudgetRepository } from "../../repositories/budget.repository";

export interface UpdateManyBudgetsUseCase {
    execute(id: number, dto: UpdateBudgetDto[]): Promise<string | CustomResponse>;
}

export class UpdateManyBudgets implements UpdateManyBudgetsUseCase {

    constructor(
        private repository: BudgetRepository
    ) { }
    execute(id: number, dto: UpdateBudgetDto[]): Promise<string | CustomResponse> {
        return this.repository.updateMany(dto)
    }
}