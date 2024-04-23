import { CustomResponse } from "../../../utils/response/custom.response";
import { UpdateWalletDto } from "../../dtos/wallet/update-wallet.dto";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface UpdateWalletUseCase {
    execute(id: number, data: UpdateWalletDto,): Promise<string | CustomResponse>
}

export class UpdateWallet implements UpdateWalletUseCase {

    constructor(
        private readonly repository: WalletRepository
    ) { }
    execute(id: number, data: UpdateWalletDto,): Promise<string | CustomResponse> {
        return this.repository.update(id, data, data.userId!)
    }

}