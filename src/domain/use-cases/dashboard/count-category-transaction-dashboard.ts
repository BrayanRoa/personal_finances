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
    async execute(userId: string): Promise<CustomResponse | CountTransactionCategoryEntity[]> {
        const a = await this.repository.summaryTransactionsByCategory(userId)
        console.log("VAMOS",a);
        return a
    }
}