import { WalletDatasource } from "../../domain/datasources/wallet.datasource";
import { CreateWalletDto } from "../../domain/dtos/wallet/create-wallet.dto";
import { UpdateWalletDto } from "../../domain/dtos/wallet/update-wallet.dto";
import { WalletEntity } from "../../domain/entities/wallet/wallet.entity";
import { WalletRepository } from "../../domain/repositories/wallet.repository";
import { CustomResponse } from "../../utils/response/custom.response";

export class WalletRepositoryImp implements WalletRepository {

    constructor(
        private readonly dataSource: WalletDatasource
    ) { }
    getAll(userId: string): Promise<CustomResponse | WalletEntity[]> {
        return this.dataSource.getAll(userId)
    }
    create(data: CreateWalletDto, user_audits: string): Promise<string | CustomResponse> {
        data.name = data.name.toUpperCase()
        return this.dataSource.create(data, user_audits)
    }
    delete(id: number, user_audits: string): Promise<string | CustomResponse> {
        return this.dataSource.delete(id, user_audits)
    }
    findById(id: number, userId: string): Promise<CustomResponse | WalletEntity> {
        return this.dataSource.findById(id, userId)
    }
    update(id: number, data: UpdateWalletDto, user_audits: string): Promise<string | CustomResponse> {
        return this.dataSource.update(id, data, user_audits)
    }

}