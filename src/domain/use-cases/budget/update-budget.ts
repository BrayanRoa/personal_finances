import { CustomResponse } from "../../../utils/response/custom.response";
import { UpdateBudgetDto } from "../../dtos/budget/update-budget.dto";
import { BudgetRepository } from "../../repositories/budget.repository";

export interface UpdateBudgetUseCase {
    execute(id: number, dto: UpdateBudgetDto): Promise<string | CustomResponse>;
}


export class UpdateBudget implements UpdateBudgetUseCase {

    constructor(
        private repository: BudgetRepository
    ) { }
    execute(id: number, dto: UpdateBudgetDto): Promise<string | CustomResponse> {
        return this.repository.update(id, dto, dto.userId)
    }


}