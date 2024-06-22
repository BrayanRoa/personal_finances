import { CustomResponse } from "../../../utils/response/custom.response";
import { TransactionEntity, WalletEntity } from "../../entities";
import { TransactionRepository } from "../../repositories/transaction.repository";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface DeleteTransactionUseCase {
    execute(id: number, user_audits: string): Promise<string | CustomResponse>;
}


export class DeleteTransaction implements DeleteTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
        private walletRepository: WalletRepository
    ) {
    }
    async execute(id: number, user_audits: string): Promise<string | CustomResponse> {
        const deletedTransaction = await this.repository.delete(id, user_audits)
        if (deletedTransaction instanceof CustomResponse) {
            return deletedTransaction;
        }

        const transaction = await this.repository.findById(id, user_audits)
        if (!(transaction instanceof TransactionEntity)) {
            return transaction;
        }

        const wallet = await this.walletRepository.findById(transaction.walletId, user_audits)
        if (!(wallet instanceof WalletEntity)) {
            return wallet
        }

        const newBalance = Number(wallet.balance) + Number(transaction.amount);
        await this.walletRepository.update(wallet.id, { balance: newBalance }, user_audits)

        return deletedTransaction;
    }
}