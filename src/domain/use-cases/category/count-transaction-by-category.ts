import { TransactionByCategory } from "../../../utils/interfaces/count_transaction_by_category.interface";
import { CustomResponse } from "../../../utils/response/custom.response";
import { CategoryRepository } from "../../repositories/category.repository";

export interface CountTransactionByCategoryUseCase {
    execute(userId: string, walletId: number): Promise<TransactionByCategory[] | CustomResponse>;
}

export class CountTransactionByCategory implements CountTransactionByCategoryUseCase {

    constructor(
        public repository: CategoryRepository
    ) { }
    execute(userId: string, walletId: number): Promise<TransactionByCategory[] | CustomResponse> {
        console.log(userId, walletId);
        return this.repository.transactionWithCategoriesAndAmount(userId, walletId)
    }
}