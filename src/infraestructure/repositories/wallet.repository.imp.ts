import { WalletDatasource } from "../../domain/datasources/wallet.datasource";
import { CreateWalletDto } from "../../domain/dtos/wallet/create-wallet.dto";
import { UpdateWalletDto } from "../../domain/dtos/wallet/update-wallet.dto";
import { WalletEntity } from "../../domain/entities/wallet/wallet.entity";
import { IMonthlyBalanceByWallet, IncomesAndExpensesByWallet } from "../../domain/interfaces/wallets/wallets.interface";
import { WalletRepository } from "../../domain/repositories/wallet.repository";
import { DashboardInterface } from "../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../utils/response/custom.response";

export class WalletRepositoryImp implements WalletRepository {

    constructor(
        private readonly walletDatasource: WalletDatasource
    ) { }
    monthlyBalanceByWallet(userId: string, year: number): Promise<CustomResponse | IMonthlyBalanceByWallet[]> {
        return this.walletDatasource.monthlyBalanceByWallet(userId, year)
    }
    totalIncomesAndExpensesByWallet(userId: string): Promise<CustomResponse | IncomesAndExpensesByWallet[]> {
        return this.walletDatasource.totalIncomesAndExpensesByWallet(userId)
    }
    infoWallet(id: number, userId: string): Promise<DashboardInterface | CustomResponse> {
        return this.walletDatasource.infoWallet(id, userId)
    }
    findByIds(id: number[]): Promise<CustomResponse | WalletEntity[]> {
        return this.walletDatasource.findByIds(id);
    }
    getAll(userId: string): Promise<CustomResponse | WalletEntity[]> {
        return this.walletDatasource.getAll(userId)
    }
    create(data: CreateWalletDto, user_audits: string): Promise<WalletEntity | CustomResponse> {
        data.name = data.name.toUpperCase()
        // data.balance = data.initial_balance
        // data.incomes = data.initial_balance
        return this.walletDatasource.create(data, user_audits)
    }
    delete(id: number, user_audits: string): Promise<string | CustomResponse> {
        return this.walletDatasource.delete(id, user_audits)
    }
    findById(id: number, userId: string): Promise<CustomResponse | WalletEntity> {
        return this.walletDatasource.findById(id, userId)
    }
    update(id: number, data: UpdateWalletDto, user_audits: string): Promise<string | CustomResponse> {
        return this.walletDatasource.update(id, data, user_audits)
    }

}