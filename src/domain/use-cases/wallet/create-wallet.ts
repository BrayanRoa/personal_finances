import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateWalletDto } from "../../dtos/wallet/create-wallet.dto";
import { WalletEntity } from "../../entities/wallet/wallet.entity";
import { TransactionRepository } from "../../repositories/transaction.repository";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface CreateWalletUseCase {
    execute(dto: CreateWalletDto): Promise<WalletEntity | string | CustomResponse>;
}

export class CreateWallet implements CreateWalletUseCase {

    constructor(
        private readonly repository: WalletRepository,
        private readonly transaction: TransactionRepository
    ) { }
    async execute(dto: CreateWalletDto): Promise<string | WalletEntity | CustomResponse> {
        const wallet = await this.repository.create(dto, dto.userId)
        if (wallet instanceof WalletEntity) {
            // here i am creating the firts transaction because the user add the initial value to the wallet
            await this.transaction.create({
                active: false,
                amount: dto.initial_balance,
                description: "Initial Balance",
                type: "INCOME",
                walletId: wallet.id,
                userId: dto.userId,
                date: new Date(),
                categoryId: 12,
                repeat: 'NEVER',
                name: 'Initial Balance',
                next_date: new Date()
            })
        }
        return "Wallet created successfully"
    }

}