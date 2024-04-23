import { CustomResponse } from "../../../utils/response/custom.response";
import { WalletEntity } from "../../entities/wallet/wallet.entity";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface DeleteWalletUseCase {
    execute(id: number, user_audits: string): Promise<WalletEntity | string | CustomResponse>;
}

export class DeleteWallet implements DeleteWalletUseCase {

    constructor(
        private readonly repository: WalletRepository
    ) { }
    execute(id: number, user_audits: string): Promise<string | WalletEntity | CustomResponse> {
        return this.repository.delete(id, user_audits)
    }

}