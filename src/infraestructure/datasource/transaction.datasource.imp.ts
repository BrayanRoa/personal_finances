import { Prisma } from "@prisma/client";
import { TransactionDatasource } from "../../domain/datasources/transaction.datasource";
import { CreateTransactionDto } from "../../domain/dtos/transaction/create-transaction.dto";
import { UpdateTransactionDto } from "../../domain/dtos/transaction/update-transaction.dto";
import { TransactionEntity } from "../../domain/entities/transaction/transaction.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { TransactionInterface } from "../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../utils/response/custom.response";
import { calculateNextDateToTransaction } from "../../works/processRecurringTransactions";
import { Decimal } from "@prisma/client/runtime/library";

export class TransactionDatasourceImp extends BaseDatasource implements TransactionDatasource {

    constructor() {
        super()
        this.audit_class = "TRANSACTION"
    }
    transactionWithCategories(idCategory: number, userId: string): Promise<CustomResponse | boolean> {
        return this.handleErrors(async () => {
            const transaction = await BaseDatasource.prisma.transaction.findMany({
                where: {
                    categoryId: idCategory, userId
                },
            })
            return transaction.length > 0 ? true : false
        })
    }
    update(id: number, data: UpdateTransactionDto[] | UpdateTransactionDto): Promise<{ action: string, amountDifference: number } | CustomResponse | string> {
        return this.handleErrors(async () => {
            if (data instanceof Array) {
                const updateUserOperations = data.map(({ id, userId, ...rest }) => {
                    if (rest.repeat === "NEVER") {
                        rest.active = false
                        rest.next_date = null
                    }
                    return BaseDatasource.prisma.transaction.update({
                        where: { id },
                        data: rest
                    })
                })
                const action = await BaseDatasource.prisma.$transaction(updateUserOperations)
                action.forEach(data => {
                    this.auditSave(data.id, data, "UPDATE", data.userId)
                })
                return "transactions updated successfully"
            } else {
                const { userId, ...updateData } = data;
                if (updateData.repeat === "NEVER") {
                    updateData.active = false;
                    updateData.next_date = null;
                }

                const transaction = await this.findById(id, userId)
                if (transaction instanceof CustomResponse) {
                    return transaction;
                }

                const action = transaction.amount !== updateData.amount ?
                    (transaction.amount < updateData?.amount! ? "ADD" : "SUBTRACT") : "";

                const amountDifference = Math.abs(transaction.amount - updateData?.amount!);

                const updateTransactionResult = await BaseDatasource.prisma.transaction.updateMany({
                    where: { AND: [{ id }, { userId }] },
                    data: updateData
                })

                if (updateTransactionResult.count === 0) return new CustomResponse(`Don't exist transaction with this id ${id}`, 404)

                this.auditSave(id, updateData, "UPDATE", userId);

                return { action, amountDifference }
            }
        })
    }

    create(data: CreateTransactionDto[] | CreateTransactionDto): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            // console.log("soy la data entrante",{data});
            if (data instanceof Array) {
                const createUserOperations = data.map(item =>
                    BaseDatasource.prisma.transaction.create({ data: item })
                )
                const transactions = await BaseDatasource.prisma.$transaction(createUserOperations)
                transactions.forEach(transaction => {
                    this.auditSave(transaction.id, transaction, "CREATE", transaction.userId)
                })
            } else {
                if (data.repeat !== "NEVER") {
                    data = calculateNextDateToTransaction(data)
                }
                const transaction = await BaseDatasource.prisma.transaction.create({ data })
                this.auditSave(transaction.id, transaction, "CREATE", transaction.userId)
            }
            return "Transaction created successfully"
        })
    }
    // getAll(userId: string, search: string | undefined, page: number, per_page: number): Promise<CustomResponse | TransactionInterface> {
    //     return this.handleErrors(async () => {
    //         let action = null;
    //         let totalRecords = 0;
    //         if (search) {
    //             action = await BaseDatasource.prisma.transaction.findMany({
    //                 where: {
    //                     AND: [
    //                         {
    //                             deleted_at: null,
    //                             userId: userId,
    //                         },
    //                         {
    //                             OR: [
    //                                 {
    //                                     description: {
    //                                         contains: search,
    //                                         mode: 'insensitive',
    //                                     },
    //                                 },
    //                                 {
    //                                     type: {
    //                                         contains: search,
    //                                         mode: 'insensitive',
    //                                     },
    //                                 },
    //                                 {
    //                                     amount: {
    //                                         equals: parseFloat(search)
    //                                     }
    //                                 }
    //                             ],
    //                         },
    //                     ],
    //                 },
    //                 orderBy: { date: 'desc' },
    //                 skip: (page - 1) * per_page,
    //                 take: per_page,
    //             });
    //         } else {
    //             totalRecords = await BaseDatasource.prisma.transaction.count({
    //                 where: {
    //                     AND: [{ deleted_at: null, userId }]
    //                 }
    //             });

    //             action = await BaseDatasource.prisma.transaction.findMany({
    //                 where: {
    //                     AND: [{ deleted_at: null, userId }]
    //                 },
    //                 orderBy: { date: 'desc' },
    //                 skip: (page - 1) * per_page,
    //                 take: per_page,
    //             })
    //         }
    //         return {
    //             transactions: action.map(transaction => TransactionEntity.fromObject(transaction)),
    //             meta:
    //             {
    //                 totalRecords,
    //                 totalPages: Math.ceil(totalRecords / per_page),
    //                 currentPage: page,
    //                 next_page: true ? Math.ceil(totalRecords / per_page) > page : false,
    //             }
    //         }
    //     })
    // }


    getAll(userId: string, search: string | undefined, page: number, per_page: number): Promise<CustomResponse | TransactionInterface> {
        return this.handleErrors(async () => {

            const commonParams: Prisma.TransactionFindManyArgs = {
                orderBy: { date: 'desc' },
                skip: (page - 1) * per_page,
                take: per_page,
            };

            let action = [];
            let totalRecords = 0;

            if (search) {
                // Caso con búsqueda
                action = await BaseDatasource.prisma.transaction.findMany({
                    where: {
                        AND: [
                            { deleted_at: null, userId: userId },
                            {
                                OR: [
                                    { description: { contains: `${search}`, mode: 'insensitive' } },
                                    { type: { contains: `${search}`, mode: 'insensitive' } },
                                    { amount: { equals: parseFloat(search) || 0 } },
                                    { repeat: { contains: `${search}`, mode: 'insensitive' } },
                                    { category: { name: { contains: `${search}`, mode: 'insensitive' } } },
                                    { wallet: { name: { contains: `${search}`, mode: 'insensitive' } } }
                                ],
                            },
                        ],
                    },
                    include: {
                        wallet: true,
                        category: true,
                    },
                    ...commonParams
                });
            } else {
                // Caso sin búsqueda
                [totalRecords, action] = await Promise.all([
                    BaseDatasource.prisma.transaction.count({
                        where: { deleted_at: null, userId: userId },
                    }),
                    BaseDatasource.prisma.transaction.findMany({
                        where: { deleted_at: null, userId: userId },
                        ...commonParams,
                        include: {
                            wallet: true,
                            category: true,
                        }
                    }),
                ]);
            }
            return {
                transactions: action.map(transaction => TransactionEntity.fromObject(transaction)),
                meta: {
                    totalRecords,
                    totalPages: Math.ceil(totalRecords / per_page),
                    currentPage: page,
                    next_page: totalRecords > page * per_page,
                }
            }
        });
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
                    AND: [{ id }, { userId: user_audits }, { deleted_at: null }]
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