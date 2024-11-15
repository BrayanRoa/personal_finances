import { CustomResponse } from "../../../utils/response/custom.response";
import { SummaryWalletEntity } from "../../entities/dashboard/summary-wallets.entity";
import { DasbboardRepository } from "../../repositories/dashboard.repository";

export interface SummaryWalletUseCase {
    execute(userId: string): Promise<CustomResponse | SummaryWalletEntity>;
}

export class SummaryWallet implements SummaryWalletUseCase {
    constructor(
        private repository: DasbboardRepository,
    ) { }
    execute(userId: string): Promise<CustomResponse | SummaryWalletEntity> {
        return this.repository.summaryWallets(userId)
    }

}