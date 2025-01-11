import { CustomResponse } from "../../../utils/response/custom.response";
import { BudgetEntity } from "../../entities/budget/budget.entity";
import { BudgetRepository } from "../../repositories/budget.repository";

export interface GetOneUseCase {
    execute(id: number, userId: string): Promise<BudgetEntity | CustomResponse>;
}

export class GetOneBudget implements GetOneUseCase {

    constructor(
        private repository: BudgetRepository,
    ) { }

    async execute(id: number, userId: string): Promise<BudgetEntity | CustomResponse> {
        return this.repository.getOne(id, userId)
    }
}