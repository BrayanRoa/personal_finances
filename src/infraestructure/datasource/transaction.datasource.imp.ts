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
    update(id: number, data: UpdateTransactionDto[] | UpdateTransactionDto, user_audits: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            let updateUserOperations
            if (data instanceof Array) {
                updateUserOperations = data.map(data => BaseDatasource.prisma.transaction.update({
                    where: {
                        id: data.id
                    },
                    data: data
                }))
                const action = await BaseDatasource.prisma.$transaction(updateUserOperations)
                action.forEach(data => {
                    this.auditSave(data.id, action, "UPDATE", user_audits)
                })
                return "transactions updated successfully"
            } else {
                const { userId, ...rest } = data
                const action = await BaseDatasource.prisma.transaction.updateMany({
                    where: { AND: [{ id }, { userId }] },
                    data: rest
                })
                if (action.count === 0) return new CustomResponse(`Don't exist transaction with this id ${id}`, 404)
                this.auditSave(id, rest, "UPDATE", user_audits)
                return "Transaction update successful"
            }
        })
    }

    create(data: CreateTransactionDto[] | CreateTransactionDto): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            let createUserOperations
            if (data instanceof Array) {
                createUserOperations = data.map(data => BaseDatasource.prisma.transaction.create({ data: data }))
                const action = await BaseDatasource.prisma.$transaction(createUserOperations)
                action.forEach(data => {
                    this.auditSave(data.id, action, "CREATE", data.userId)
                })
            } else {
                data = calculateNextDate(data)
                const action = await BaseDatasource.prisma.transaction.create({
                    data
                })
                this.auditSave(action.id, action, "CREATE", data.userId)
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
            today.setHours(0, 0, 0, 0);
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