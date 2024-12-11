import { Prisma } from "@prisma/client";
import { TransactionDatasource } from "../../domain/datasources/transaction.datasource";
import { CreateTransactionDto } from "../../domain/dtos/transaction/create-transaction.dto";
import { UpdateTransactionDto } from "../../domain/dtos/transaction/update-transaction.dto";
import { TransactionEntity } from "../../domain/entities/transaction/transaction.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { TransactionInterface } from "../../utils/interfaces/response_paginate";
import { CustomResponse } from "../../utils/response/custom.response";
import { calculateNextDateToTransaction } from "../../works/processRecurringTransactions";
import { FiltersTransaction } from "../../utils/interfaces/filters-transactions.interface";

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

    getAllWithFilters(
        userId: string, search: string | undefined, page: number, per_page: number, filters: FiltersTransaction): Promise<CustomResponse | TransactionInterface> {
        return this.handleErrors(async () => {

            let action = [];
            let totalRecords = 0;
            let totalExpenses = 0
            let totalIncome = 0

            // base params
            const commonParams: Prisma.TransactionFindManyArgs = {
                orderBy: [{ date: 'desc' }, { id: 'asc' }],
                skip: (page - 1) * per_page,
                take: per_page,
                include: {
                    wallet: true,
                    category: true,
                },
            };

            // base conditions
            const baseCondition = {
                AND: [
                    {
                        deleted_at: null,
                        userId: userId,
                    }
                ],
            }

            // filters added by the user

            // create a new filter 
            let where: any[] = [];

            if (filters.categoryIds) {
                where.push(filters.categoryIds && { categoryId: { in: filters.categoryIds } })
            }

            if (filters.walletIds) {
                where.push(filters.walletIds && { walletId: { in: filters.walletIds } })
            }

            if (filters.repeats) {
                where.push(filters.repeats && { repeat: { in: filters.repeats } })
            }

            if (filters.types) {
                where.push(filters.types && { type: { in: filters.types } })
            }

            console.log("EL WHERE", ...where);

            if (search) {
                // Caso con búsqueda
                [totalRecords, action] = await Promise.all([
                    BaseDatasource.prisma.transaction.count({
                        where: {
                            AND: [
                                baseCondition,
                                ...where,
                                {
                                    OR: [
                                        { name: { contains: `${search}`, mode: 'insensitive' } },
                                        { repeat: { contains: `${search}`, mode: 'insensitive' } },
                                        { description: { contains: `${search}`, mode: 'insensitive' } },
                                        { type: { contains: `${search}`, mode: 'insensitive' } },
                                        { category: { name: { contains: `${search}`, mode: 'insensitive' } } },
                                        { wallet: { name: { contains: `${search}`, mode: 'insensitive' } } },
                                        { amount: { equals: parseFloat(search) || 0 } },
                                    ],
                                },
                            ],
                        },
                    }),
                    BaseDatasource.prisma.transaction.findMany({
                        where: {
                            AND: [
                                baseCondition,
                                ...where,
                                {
                                    OR: [
                                        { name: { contains: `${search}`, mode: 'insensitive' } },
                                        { repeat: { contains: `${search}`, mode: 'insensitive' } },
                                        { description: { contains: `${search}`, mode: 'insensitive' } },
                                        { type: { contains: `${search}`, mode: 'insensitive' } },
                                        { category: { name: { contains: `${search}`, mode: 'insensitive' } } },
                                        { wallet: { name: { contains: `${search}`, mode: 'insensitive' } } },
                                        { amount: { equals: parseFloat(search) || 0 } },
                                    ],
                                },
                            ],
                        },
                        ...commonParams
                    })
                ])
            } else {
                // Caso sin búsqueda
                [totalRecords, action] = await Promise.all([
                    BaseDatasource.prisma.transaction.count({
                        where: {
                            AND: [
                                baseCondition,
                                ...where,
                            ]
                        },
                    }),
                    BaseDatasource.prisma.transaction.findMany({
                        where: {
                            AND: [
                                baseCondition,
                                ...where,
                            ]
                        },
                        ...commonParams,
                        // orderBy: {
                        //     [order]: asc === 'true' ? 'asc' : 'desc',
                        // },
                    }),
                ]);

                const [expenses, income] = await Promise.all([
                    BaseDatasource.prisma.transaction.aggregate({
                        _sum: {
                            amount: true
                        },
                        where: { ...baseCondition.AND[0], type: "OUTFLOW" },
                    }),
                    BaseDatasource.prisma.transaction.aggregate({
                        _sum: {
                            amount: true
                        },
                        where: { ...baseCondition.AND[0], type: "INCOME" },
                    })
                ])

                totalIncome = income._sum.amount ? income._sum.amount : 0;
                totalExpenses = expenses._sum.amount ? expenses._sum.amount : 0;
            }
            return {
                transactions: action.map(transaction => TransactionEntity.fromObject(transaction)),
                totalIncome: totalIncome,
                totalExpenses: totalExpenses,
                meta: this.calculateMeta(totalRecords, per_page, page)
            }
        })
    }

    // getAll(userId: string, search: string | undefined, page: number, per_page: number, year: number, month: number, walletId: number, order: string, asc: string): Promise<CustomResponse | TransactionInterface> {
    //     return this.handleErrors(async () => {

    //         console.log("VAMOOOSSS",
    //             await this.getAllTest(userId, page, per_page)
    //         );
    //         let action = [];
    //         let totalRecords = 0;
    //         let totalExpenses = 0
    //         let totalIncome = 0

    //         let startDate = new Date(Date.UTC(year, month - 1, 1));
    //         let endDate = new Date(Date.UTC(year, month));

    //         const commonParams: Prisma.TransactionFindManyArgs = {
    //             orderBy: [{ date: 'desc' }, { id: 'asc' }],
    //             skip: (page - 1) * per_page,
    //             take: per_page,
    //             include: {
    //                 wallet: true,
    //                 category: true,
    //             },
    //         };

    //         const baseCondition = {
    //             AND: [
    //                 {
    //                     deleted_at: null,
    //                     userId: userId,
    //                     walletId, date: { gte: startDate, lt: endDate },
    //                 }
    //             ],
    //         }
    //         console.log("AAAAAAA", parseFloat(search!));
    //         const validOrderFields = ['date', 'description']; // y cualquier otro campo válido
    //         if (!validOrderFields.includes(order)) {
    //             order = 'date'; // establecer un valor por defecto
    //         }

    //         if (search) {
    //             // Caso con búsqueda
    //             [totalRecords, action] = await Promise.all([
    //                 BaseDatasource.prisma.transaction.count({
    //                     where: {
    //                         AND: [
    //                             baseCondition,
    //                             {
    //                                 OR: [
    //                                     { name: { contains: `${search}`, mode: 'insensitive' } },
    //                                     { repeat: { contains: `${search}`, mode: 'insensitive' } },
    //                                     { description: { contains: `${search}`, mode: 'insensitive' } },
    //                                     { type: { contains: `${search}`, mode: 'insensitive' } },
    //                                     { category: { name: { contains: `${search}`, mode: 'insensitive' } } },
    //                                     { wallet: { name: { contains: `${search}`, mode: 'insensitive' } } },
    //                                     { amount: { equals: parseFloat(search) || 0 } },
    //                                 ],
    //                             },
    //                         ],
    //                     },
    //                 }),
    //                 BaseDatasource.prisma.transaction.findMany({
    //                     where: {
    //                         AND: [
    //                             baseCondition,
    //                             {
    //                                 OR: [
    //                                     { name: { contains: `${search}`, mode: 'insensitive' } },
    //                                     { repeat: { contains: `${search}`, mode: 'insensitive' } },
    //                                     { description: { contains: `${search}`, mode: 'insensitive' } },
    //                                     { type: { contains: `${search}`, mode: 'insensitive' } },
    //                                     { category: { name: { contains: `${search}`, mode: 'insensitive' } } },
    //                                     { wallet: { name: { contains: `${search}`, mode: 'insensitive' } } },
    //                                     { amount: { equals: parseFloat(search) || 0 } },
    //                                 ],
    //                             },
    //                         ],
    //                     },
    //                     ...commonParams
    //                 })
    //             ])
    //         } else {
    //             // Caso sin búsqueda
    //             [totalRecords, action] = await Promise.all([
    //                 BaseDatasource.prisma.transaction.count({
    //                     where: baseCondition,
    //                 }),
    //                 BaseDatasource.prisma.transaction.findMany({
    //                     where: baseCondition,
    //                     ...commonParams,
    //                     // orderBy: {
    //                     //     [order]: asc === 'true' ? 'asc' : 'desc',
    //                     // },
    //                 }),
    //             ]);

    //             const [expenses, income] = await Promise.all([
    //                 BaseDatasource.prisma.transaction.aggregate({
    //                     _sum: {
    //                         amount: true
    //                     },
    //                     where: { ...baseCondition.AND[0], type: "OUTFLOW" },
    //                 }),
    //                 BaseDatasource.prisma.transaction.aggregate({
    //                     _sum: {
    //                         amount: true
    //                     },
    //                     where: { ...baseCondition.AND[0], type: "INCOME" },
    //                 })
    //             ])

    //             totalIncome = income._sum.amount ? income._sum.amount : 0;
    //             totalExpenses = expenses._sum.amount ? expenses._sum.amount : 0;
    //         }
    //         return {
    //             transactions: action.map(transaction => TransactionEntity.fromObject(transaction)),
    //             totalIncome: totalIncome,
    //             totalExpenses: totalExpenses,
    //             meta: this.calculateMeta(totalRecords, per_page, page)
    //         }
    //     });
    // }

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

    getYears(user_audits: string): Promise<CustomResponse | number[]> {
        return this.handleErrors(async () => {
            const action = await BaseDatasource.prisma.transaction.findMany({
                select: {
                    date: true
                },
                where: {
                    userId: user_audits,
                    deleted_at: null
                },
                orderBy: {
                    created_at: "asc"
                }
            })
            if (action.length === 0) return []
            const years = action.map(transaction => transaction.date.getFullYear())
            return [...new Set(years)]
        })
    }
}