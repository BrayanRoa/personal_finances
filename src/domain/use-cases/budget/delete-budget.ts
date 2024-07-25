import { CustomResponse } from "../../../utils/response/custom.response";
import { BudgetRepository } from "../../repositories/budget.repository";

export interface DeleteBudgetUseCase {
    execute(id: number, userId: string): Promise<string | CustomResponse>;
}


export class DeleteBudget implements DeleteBudgetUseCase {

    constructor(
        private readonly repository: BudgetRepository
    ) { }
    execute(id: number, userId: string): Promise<CustomResponse | string> {
        return this.repository.delete(id, userId)
    }

}