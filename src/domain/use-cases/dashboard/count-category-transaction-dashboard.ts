import { CustomResponse } from "../../../utils/response/custom.response";
import { CountTransactionCategoryEntity } from "../../entities/dashboard/count-transaction-category.entity";
import { DasbboardRepository } from "../../repositories/dashboard.repository";

export interface CountCategoryTransactionUseCase {
    execute(userId: string): Promise<CustomResponse | CountTransactionCategoryEntity[]>;
}

export class CountCategoryTransaction implements CountCategoryTransactionUseCase {
    constructor(
        private repository: DasbboardRepository,
    ) { }
    execute(userId: string): Promise<CustomResponse | CountTransactionCategoryEntity[]> {
        return this.repository.summaryTransactionsByCategory(userId)
    }
}