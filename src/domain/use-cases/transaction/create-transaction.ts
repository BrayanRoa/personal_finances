import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateTransactionDto } from "../../dtos/transaction/create-transaction.dto";
import { WalletEntity } from "../../entities";
import { BudgetRepository } from "../../repositories/budget.repository";
import { TransactionRepository } from "../../repositories/transaction.repository";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface CreateTransactionUseCase {
    execute(dto: CreateTransactionDto[] | CreateTransactionDto): Promise<string | CustomResponse>;
}


export class CreateTransaction implements CreateTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
        private wallet: WalletRepository,
        private budget: BudgetRepository
    ) {
    }
    async execute(dto: CreateTransactionDto[] | CreateTransactionDto): Promise<string | CustomResponse> {
        const transaction = await this.repository.create(dto)

        // Asegurarse de que dto sea siempre un array
        dto = Array.isArray(dto) ? dto : [dto];

        for (const item of dto) {
            let walletData = await this.wallet.findById(item.walletId, item.userId)

            if (walletData instanceof WalletEntity) {
                walletData.balance = item.type === "INCOME"
                    ? Number(walletData.balance) + Number(item.amount)
                    : Number(walletData.balance) - Number(item.amount);

                await this.wallet.update(item.walletId, { balance: walletData.balance }, item.userId)

                if (item.type === "INCOME"){
                    // const budget = await this.budget.getOne()
                    // if (budget) {
                    //     budget.amount += item.amount;
                    //     await this.budget.update(budget.id, budget)
                    // }
                }
            }
        }

        return transaction

    }
}