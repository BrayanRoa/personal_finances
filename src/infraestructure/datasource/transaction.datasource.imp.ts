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
import { QueryBuilder } from "../../utils/query-builder";

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
    update(id: number, data: UpdateTransactionDto[] | UpdateTransactionDto): Promise<{ action: string, amountDifference: number, typeChange: string } | CustomResponse | string> {
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

                const type_change = transaction.type !== updateData.type ? updateData.type : ""

                const amountDifference = Math.abs(transaction.amount - updateData?.amount!);

                const updateTransactionResult = await BaseDatasource.prisma.transaction.updateMany({
                    where: { AND: [{ id }, { userId }] },
                    data: updateData
                })

                if (updateTransactionResult.count === 0) return new CustomResponse(`Don't exist transaction with this id ${id}`, 404)

                this.auditSave(id, updateData, "UPDATE", userId);

                return { action, amountDifference, typeChange: type_change! }
            }
        })
    }

    create(data: CreateTransactionDto[] | CreateTransactionDto): Promise<string | TransactionEntity | CustomResponse> {
        return this.handleErrors(async () => {
            let transaction;
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
                transaction = await BaseDatasource.prisma.transaction.create({ data })
                this.auditSave(transaction.id, transaction, "CREATE", transaction.userId)
                return TransactionEntity.fromObject(transaction)
            }
            return "Transaction created successfully"
        })
    }

    getAllWithFilters(
        userId: string, search: string | undefined, page: number, per_page: number, filters: FiltersTransaction): Promise<CustomResponse | TransactionInterface> {
        return this.handleErrors(async () => {

            // const dates = calculateMonths(filters.year!, filters.months!)
            const dates = QueryBuilder.calculateMonths(filters.year!, filters.months!)

            // base conditions
            const baseCondition = {
                deleted_at: null,
                userId: userId,
            }

            // search condition
            const searchCondition = search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { repeat: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                        { type: { contains: search, mode: 'insensitive' } },
                        { category: { name: { contains: search, mode: 'insensitive' } } },
                        { wallet: { name: { contains: search, mode: 'insensitive' } } },
                        { amount: { equals: parseFloat(search) || 0 } },
                    ],
                }
                : undefined;

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

            let filtersConditions: any[] = [];

            // Mapeo de las claves del objeto `filters` con los campos y operadores en la base de datos
            const conditionsMap = [
                { key: 'categoryIds', field: 'categoryId', operator: 'in' },
                { key: 'walletIds', field: 'walletId', operator: 'in' },
                { key: 'repeats', field: 'repeat', operator: 'in' },
                { key: 'types', field: 'type', operator: 'in' },
            ];

            // Iterar sobre el mapeo para agregar condiciones dinámicamente
            conditionsMap.forEach(({ key, field, operator }) => {
                const value = filters[key as keyof FiltersTransaction];
                if (value) {
                    filtersConditions.push({
                        [field]: { [operator]: value },
                    });
                }
            });

            // Agregar condiciones para las fechas si existen
            if (dates) {
                filtersConditions.push({
                    OR: dates.map(dateRange => ({
                        date: { gte: dateRange.start, lte: dateRange.end },
                    })),
                });
            }

            // create the base condition to be used for all queries
            const baseWhere = {
                AND: [
                    baseCondition,
                    ...filtersConditions,
                ],
            };

            // Add search condition if it exists
            if (search) {
                baseWhere.AND.push(searchCondition);
            }

            // Executing condition-based promises
            const [totalRecords, action] = await Promise.all([
                BaseDatasource.prisma.transaction.count({
                    where: baseWhere,
                }),
                BaseDatasource.prisma.transaction.findMany({
                    where: baseWhere,
                    ...commonParams,
                }),
            ]);

            // condition to check the balance between months
            const condition = {
                ...baseCondition,
                OR: dates.map(dateRange => ({
                    date: { gte: dateRange.start, lte: dateRange.end },
                })),
            }

            const [expenses, income] = await Promise.all([
                this.calculateSum(condition, "OUTFLOW"),
                this.calculateSum(condition, "INCOME"),
            ]);

            return {
                transactions: action.map(transaction => TransactionEntity.fromObject(transaction)),
                totalIncome: income,
                totalExpenses: expenses,
                meta: this.calculateMeta(totalRecords, per_page, page),
            };
        })
    }

    private async calculateSum(baseCondition: any, type: string): Promise<number> {
        const result = await BaseDatasource.prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { ...baseCondition, type },
        });
        return result._sum.amount || 0;
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
                    date: "desc"
                }
            })
            if (action.length === 0) return []
            const years = action.map(transaction => {
                return transaction.date.getUTCFullYear()
            })
            return [...new Set(years)]
        })
    }

    transactionByBudget(page: number, per_page: number, userId: string, categories: number[], startDate: Date, endDate: Date): Promise<CustomResponse | TransactionInterface> {
        return this.handleErrors(async () => {

            const commonParams: Prisma.TransactionFindManyArgs = {
                orderBy: [{ date: 'desc' }, { id: 'asc' }],
                skip: (page - 1) * per_page,
                take: per_page,
                include: {
                    wallet: true,
                    category: true,
                },
            };

            const baseCondition = {
                deleted_at: null,
                userId,
                type: 'OUTFLOW',
                categoryId: {
                    in: categories
                },
                date: {
                    gte: startDate, lte: endDate
                }
            }

            const [data, totalRecords] = await Promise.all([
                BaseDatasource.prisma.transaction.findMany({
                    where: baseCondition,
                    ...commonParams,
                }),
                BaseDatasource.prisma.transaction.count({
                    where: baseCondition,
                })
            ])

            return {
                transactions: data.map(transaction => TransactionEntity.fromObject(transaction)),
                meta: this.calculateMeta(totalRecords, per_page, page),
            }

        });
    }

    createTransactionBudget(idBudget: number, idTransaction: number): Promise<boolean | CustomResponse> {
        return this.handleErrors(async () => {
            const exist = await BaseDatasource.prisma.budgetTransaction.findFirst({
                where: {
                    budgetId: idBudget,
                    transactionId: idTransaction
                }
            })

            if (exist) {
                return new CustomResponse("Already exist this transaction associated with this budget", 400)
            }

            await BaseDatasource.prisma.budgetTransaction.create({
                data: {
                    budgetId: idBudget,
                    transactionId: idTransaction
                }
            })

            return true
        })
    }
}