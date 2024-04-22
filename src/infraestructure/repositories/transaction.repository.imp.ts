import { TransactionDatasource } from "../../domain/datasources/transaction.datasource";
import { CreateTransactionDto } from "../../domain/dtos/transaction/create-transaction.dto";
import { UpdateTransactionDto } from "../../domain/dtos/transaction/update-transaction.dto";
import { TransactionEntity } from "../../domain/entities/transaction/transaction.entity";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { CustomResponse } from "../../utils/response/custom.response";

export class TransactionRepositoryImp extends TransactionRepository {

    constructor(
        private readonly dataSource: TransactionDatasource
    ) {
        super()
    }
    create(data: CreateTransactionDto, user_audits: string): Promise<string | CustomResponse> {
        data.date = new Date(data.date)
        return this.dataSource.create(data, user_audits)
    }
    getAll(userId: string): Promise<CustomResponse | TransactionEntity[]> {
        return this.dataSource.getAll(userId)
    }
    findById(id: number, userId: string): Promise<CustomResponse | TransactionEntity> {
        return this.dataSource.findById(id, userId)
    }
    delete(id: number, user_audits: string): Promise<string | CustomResponse> {
        return this.dataSource.delete(id, user_audits);
    }

    update(id: number, data: UpdateTransactionDto, user_audits: string): Promise<string | CustomResponse> {
        if (data.date) {
            data.date = new Date(data.date)
        }
        return this.dataSource.update(id, data, user_audits)
    }

}