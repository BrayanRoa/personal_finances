import { DashboardInterface } from "../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../utils/response/custom.response";
import { CreateWalletDto } from "../dtos/wallet/create-wallet.dto";
import { UpdateWalletDto } from "../dtos/wallet/update-wallet.dto";
import { WalletEntity } from "../entities/wallet/wallet.entity";

export abstract class WalletDatasource {
    abstract getAll(userId: string): Promise<WalletEntity[] | CustomResponse>;
    abstract create(data: CreateWalletDto, user_audits: string): Promise<string | CustomResponse>;
    abstract delete(id: number, user_audits: string): Promise<string | CustomResponse>;
    abstract findById(id: number, userId: string): Promise<WalletEntity | CustomResponse>;
    abstract update(id: number, data: UpdateWalletDto, user_audits: string): Promise<string | CustomResponse>;
    abstract findByIds(id: number[]): Promise<CustomResponse | WalletEntity[]>
    abstract infoWallet(id: number, userId: string): Promise<DashboardInterface |CustomResponse>
}