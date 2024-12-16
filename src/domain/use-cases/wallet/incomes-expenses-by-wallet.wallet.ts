import { CustomResponse } from "../../../utils/response/custom.response";
import { IncomesAndExpensesByWallet } from "../../interfaces/wallets/wallets.interface";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface IncomesAndExpensesByWalletTypeUseCase {
    execute(userId: string): Promise<CustomResponse | IncomesAndExpensesByWallet[]>
}

export class IncomesAndExpensesByWalletType implements IncomesAndExpensesByWalletTypeUseCase {

    constructor(
        private repository: WalletRepository,
    ) { }
    async execute(userId: string): Promise<CustomResponse | IncomesAndExpensesByWallet[]> {
        const result = await this.repository.totalIncomesAndExpensesByWallet(userId)
        const types = ["INCOME", "OUTFLOW"]

        if (Array.isArray(result)) {
            const banks = [...new Set(result.map(bank => bank.name))]
            banks.flatMap(bank => {
                types.map(type => {
                    const exists = result.some((t) => t.name === bank && t.type === type);

                    if (!exists) {
                        result.push({ name: bank, type, total: 0 });
                    }
                })
            })
            result.sort((a, b) => a.name.localeCompare(b.name));
        }
        return result
    }

}