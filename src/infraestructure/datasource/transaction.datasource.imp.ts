import { TransactionDatasource } from "../../domain/datasources/transaction.datasource";
import { CreateTransactionDto } from "../../domain/dtos/transaction/create-transaction.dto";
import { UpdateTransactionDto } from "../../domain/dtos/transaction/update-transaction.dto";
import { TransactionEntity } from "../../domain/entities/transaction/transaction.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";
import { calculateNextDate } from "../../works/processRecurringTransactions";

export class TransactionDatasourceImp extends BaseDatasource implements TransactionDatasource {

    constructor() {
        super()
        this.audit_class = "TRANSACTION"
    }
    update(id: number, data: UpdateTransactionDto[] | UpdateTransactionDto): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            if (data instanceof Array) {
                const updateUserOperations = data.map(({ id, userId, ...rest }) =>
                    BaseDatasource.prisma.transaction.update({
                        where: { id },
                        data: rest
                    }))
                const action = await BaseDatasource.prisma.$transaction(updateUserOperations)
                action.forEach(data => {
                    this.auditSave(data.id, data, "UPDATE", data.userId)
                })
                return "transactions updated successfully"
            } else {
                const { userId, ...rest } = data
                const action = await BaseDatasource.prisma.transaction.updateMany({
                    where: { AND: [{ id }, { userId }] },
                    data: rest
                })
                if (action.count === 0) return new CustomResponse(`Don't exist transaction with this id ${id}`, 404)
                this.auditSave(id, rest, "UPDATE", userId)

                let wallet = await BaseDatasource.prisma.wallet.findFirst({
                    where: {
                        AND: [
                            { id: data.walletId },
                            { userId }
                        ]
                    }
                })
                if (wallet){
                    wallet!.balance = wallet?.balance! - data.amount!
                    console.log(wallet.balance);
                }
                return "Transaction update successful"
            }
        })
    }

    create(data: CreateTransactionDto[] | CreateTransactionDto): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            if (data instanceof Array) {
                const createUserOperations = data.map(item =>
                    BaseDatasource.prisma.transaction.create({ data: item })
                )
                const transactions = await BaseDatasource.prisma.$transaction(createUserOperations)
                transactions.forEach(transaction => {
                    this.auditSave(transaction.id, transaction, "CREATE", transaction.userId)
                })
            } else {
                if (data.repeat !== "NEVER"){
                    data = calculateNextDate(data)
                }
                const transaction = await BaseDatasource.prisma.transaction.create({ data })
                this.auditSave(transaction.id, transaction, "CREATE", transaction.userId)
            }
            return "Transaction created successfully"
        })
    }
    getAll(userId: string): Promise<CustomResponse | TransactionEntity[]> {
        return this.handleErrors(async () => {
            const action = await BaseDatasource.prisma.transaction.findMany({
                where: {
                    AND: [{ deleted_at: null, userId }]
                }
            })
            return action.map(transaction => TransactionEntity.fromObject(transaction))
        })
    }

    getAllRecurring(): Promise<CustomResponse | TransactionEntity[]> {
        return this.handleErrors(async () => {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            const action = await BaseDatasource.prisma.transaction.findMany({
                where: {
                    AND: [
                        { deleted_at: null },
                        { repeat: { not: "NEVER" } },
                        { next_date: today },
                        { active: true }
                    ]
                }
            })
            return action.map(transaction => TransactionEntity.fromObject(transaction))
        })
    }
    findById(id: number, userId: string): Promise<CustomResponse | TransactionEntity> {
        return this.handleErrors(async () => {
            const action = await BaseDatasource.prisma.transaction.findUnique({
                where: {
                    id, userId
                }
            })
            if (!action) return new CustomResponse("Transaction not found", 404)
            return TransactionEntity.fromObject(action)
        })
    }

    delete(id: number, user_audits: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const action = await BaseDatasource.prisma.transaction.updateMany({
                where: {
                    AND: [{ id }, { userId: user_audits }]
                },
                data: {
                    deleted_at: new Date()
                }
            })
            if (action.count === 0) return new CustomResponse(`Don't exist transaction with this id ${id}`, 404)
            this.auditSave(id, { id }, "DELETE", user_audits)
            return "Transaction deleted successfully"
        })
    }
}