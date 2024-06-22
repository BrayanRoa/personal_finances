import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateBudgetDto } from "../../dtos/budget/create-budget.dto";
import { BudgetRepository } from "../../repositories/budget.repository";

export interface CreateBudgetUseCase {
    execute(dto: CreateBudgetDto): Promise<string | CustomResponse>;
}


export class CreateBudget implements CreateBudgetUseCase {

    constructor(
        private repository: BudgetRepository
    ) { }
    execute(dto: CreateBudgetDto): Promise<string | CustomResponse> {
        return this.repository.create(dto, dto.userId)
    }


}