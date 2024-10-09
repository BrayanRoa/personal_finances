import { DashboardInterface } from "../../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../../utils/response/custom.response";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface DashboardWalletUseCase {
    execute(id: number, user_audits: string): Promise<DashboardInterface | CustomResponse>;
}

export class DashboardWallet implements DashboardWalletUseCase {

    constructor(
        private readonly repository: WalletRepository
    ) { }
    execute(id: number, user_audits: string): Promise<DashboardInterface | CustomResponse> {
        return this.repository.infoWallet(id, user_audits)
    }

}