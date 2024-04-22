import { TransactionDatasource } from "../../domain/datasources/transaction.datasource";
import { CreateTransactionDto } from "../../domain/dtos/transaction/create-transaction.dto";
import { UpdateTransactionDto } from "../../domain/dtos/transaction/update-transaction.dto";
import { TransactionEntity } from "../../domain/entities/transaction/transaction.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";

export class TransactionDatasourceImp extends BaseDatasource implements TransactionDatasource {

    constructor() {
        super()
        this.audit_class = "TRANSACTION"
    }
    update(id: number, data: UpdateTransactionDto, user_audits: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const update = await BaseDatasource.prisma.transaction.update({
                where: { id },
                data: data
            })
            this.auditSave(update, "UPDATE", user_audits)
            return "transaction update successful"
        })
    }

    create(data: CreateTransactionDto, user_audits: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const new_transaction = await BaseDatasource.prisma.transaction.create({
                data
            })
            this.auditSave(new_transaction, "CREATE", user_audits)
            return "Transaction created successfully"
        })
    }
    getAll(userId: string): Promise<CustomResponse | TransactionEntity[]> {
        return this.handleErrors(async () => {
            const transactions = await BaseDatasource.prisma.transaction.findMany({
                where: {
                    AND: [
                        { deleted_at: null, userId }
                    ]
                }
            })
            return transactions.map(transaction => TransactionEntity.fromObject(transaction))
        })
    }
    findById(id: number, userId:string): Promise<CustomResponse | TransactionEntity> {
        return this.handleErrors(async () => {
            const transaction = await BaseDatasource.prisma.transaction.findUnique({
                where: {
                    id, userId
                }
            })
            if (!transaction) {
                return new CustomResponse("Transaction not found", 404)
            }
            return TransactionEntity.fromObject(transaction)
        })
    }

    delete(id: number, user_audits: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const delete_transaction = await BaseDatasource.prisma.transaction.update({
                where: {
                    id
                },
                data: {
                    deleted_at: new Date()
                }
            })
            this.auditSave(delete_transaction, "DELETE", user_audits)
            return "Transaction deleted successfully"
        })
    }
}