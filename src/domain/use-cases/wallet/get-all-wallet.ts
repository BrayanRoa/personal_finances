import { CustomResponse } from "../../../utils/response/custom.response";
import { WalletEntity } from "../../entities/wallet/wallet.entity";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface GetAllWalletUseCase {
    execute(userId: string): Promise<WalletEntity[] | CustomResponse>;
}

export class GetAllWallet implements GetAllWalletUseCase {

    constructor(
        private repository: WalletRepository
    ) { }
    execute(userId: string): Promise<CustomResponse | WalletEntity[]> {
        return this.repository.getAll(userId)
    }

}