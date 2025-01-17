import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateBudgetDto } from "../../dtos/budget/create-budget.dto";
import { BudgetRepository } from "../../repositories/budget.repository";
import { TransactionRepository } from "../../repositories/transaction.repository";

export interface CreateBudgetUseCase {
    execute(dto: CreateBudgetDto[] | CreateBudgetDto): Promise<string | CustomResponse>;
}


export class CreateBudget implements CreateBudgetUseCase {

    constructor(
        private repository: BudgetRepository,
        private transaction: TransactionRepository
    ) { }

    async execute(dto: CreateBudgetDto): Promise<string | CustomResponse> {
        const create = await this.repository.create(dto)
        if (create instanceof CustomResponse) {
            return create
        }

        const categories = dto.categories.split(',')

        let transactions
        categories.forEach(async (c) => {
            transactions = await this.transaction.transactionByDate(dto.userId, create.date, create.end_date, +c)
            if (!(transactions instanceof CustomResponse)) {
                transactions.map(async (transaction) => {
                    await this.transaction.createTransactionBudget(create.id, transaction.id)
                })
            }
        })

        return "Budget created successfully"
    }


}