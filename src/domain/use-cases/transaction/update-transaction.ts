import { CustomResponse } from "../../../utils/response/custom.response";
import { UpdateTransactionDto } from "../../dtos/transaction/update-transaction.dto";
import { TransactionRepository } from "../../repositories/transaction.repository";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface UpdateTransactionUseCase {
    execute(id: number, dto: UpdateTransactionDto[] | UpdateTransactionDto): Promise<string | CustomResponse>;
}


export class UpdateTransaction implements UpdateTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
        private walletRepositopry: WalletRepository
    ) {
    }
    async execute(id: number, dto: UpdateTransactionDto[] | UpdateTransactionDto): Promise<string | CustomResponse> {
        const result = await this.repository.update(id, dto)
        if (result instanceof CustomResponse) {
            return result;
        }
        if (result instanceof Object) {
            if (!(dto instanceof Array)) {
                const wallet = await this.walletRepositopry.findById(dto.walletId!, dto.userId)
                if (wallet instanceof CustomResponse) {
                    return wallet;
                }
                if (result.action === "ADD") {
                    wallet.balance += result.amountDifference;
                } else if (result.action == "SUBTRACT") {
                    wallet.balance -= result.amountDifference;
                }
                await this.walletRepositopry.update(dto.walletId!, { balance: wallet.balance }, dto.userId)
            }
        }
        return "transaction update successfully"
    }
}