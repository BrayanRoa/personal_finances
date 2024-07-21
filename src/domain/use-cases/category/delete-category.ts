import { CustomResponse } from "../../../utils/response/custom.response";
import { CategoryRepository } from "../../repositories/category.repository";
import { TransactionRepository } from "../../repositories/transaction.repository";

export interface DeleteCategoryUseCase {
    execute(categoryId: number, userId: string): Promise<string | CustomResponse>;
}

export class DeleteCategory implements DeleteCategoryUseCase {
    constructor(
        private readonly repository: CategoryRepository,
        private readonly transaction: TransactionRepository
    ) { }

    async execute(categoryId: number, userId: string): Promise<string | CustomResponse> {
        const categoryTransactions = await this.transaction.transactionWithCategories(categoryId, userId);
        if (categoryTransactions instanceof CustomResponse || categoryTransactions) {
            return new CustomResponse('the category cannot be deleted because it is already associated with transactions', 400);
        }
        return this.repository.delete(categoryId, userId)
    }

}