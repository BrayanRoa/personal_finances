import { CustomResponse } from "../../../utils/response/custom.response";
import { WalletEntity } from "../../entities/wallet/wallet.entity";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface GetOneWalletUseCase{
    execute(id: number, user_audits: string): Promise<WalletEntity | string | CustomResponse>;
}   

export class GetOneWallet implements GetOneWalletUseCase{
    
    constructor(
        private readonly repository: WalletRepository
    ){}
    execute(id: number, user_audits: string): Promise<string | WalletEntity | CustomResponse> {
        return this.repository.findById(id, user_audits)
    }

}