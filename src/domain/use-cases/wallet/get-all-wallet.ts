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
    async execute(userId: string): Promise<CustomResponse | WalletEntity[]> {
        console.log(userId);
        const a =await this.repository.getAll(userId)
        console.log({a});
        return a 
    }

}