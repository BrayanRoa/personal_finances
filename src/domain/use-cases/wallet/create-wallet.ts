import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateWalletDto } from "../../dtos/wallet/create-wallet.dto";
import { WalletEntity } from "../../entities/wallet/wallet.entity";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface CreateWalletUseCase {
    execute(dto: CreateWalletDto): Promise<WalletEntity | string | CustomResponse>;
}

export class CreateWallet implements CreateWalletUseCase {

    constructor(
        private readonly repository: WalletRepository
    ) { }
    execute(dto: CreateWalletDto): Promise<string | WalletEntity | CustomResponse> {
        return this.repository.create(dto, dto.userId)
    }

}