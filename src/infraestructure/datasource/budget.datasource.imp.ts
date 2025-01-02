import { Prisma } from "@prisma/client";
import { BudgetDatasource } from "../../domain/datasources/budget.datasource";
import { CreateBudgetDto } from "../../domain/dtos/budget/create-budget.dto";
import { UpdateBudgetDto } from "../../domain/dtos/budget/update-budget.dto";
import { BudgetEntity } from "../../domain/entities/budget/budget.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";
import { calculateNextDateToBudget } from "../../works/processRecurringTransactions";
import { TransactionEntity } from "../../domain/entities";
import { TransactionInterface } from "../../utils/interfaces/response_paginate";

export class BudgetDatasourceImp extends BaseDatasource implements BudgetDatasource {

    constructor() {
        super()
        this.audit_class = "BUDGET"
    }
    delete(id: number, userId: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            await BaseDatasource.prisma.budget.updateMany({
                where: {
                    id,
                    userId
                },
                data: {
                    deleted_at: new Date()
                },
            })
            return "Budget deleted successfully"
        })
    }
    getAllRecurring(): Promise<CustomResponse | BudgetEntity[]> {
        return this.handleErrors(async () => {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            const budgets = await BaseDatasource.prisma.budget.findMany({
                where: {
                    AND: [
                        { deleted_at: null },
                        { repeat: { not: "NEVER" } },
                        { active: true },
                        { next_date: today },
                    ]
                },
                include: {
                    BudgetCategories: true
                }
            })
            const new_budget = budgets.map(budget => {
                return {
                    ...budget,
                    categories: budget.BudgetCategories.map(category => category.categoryId).toString()
                }
            })
            return new_budget.map(budget => BudgetEntity.fromObject(budget))
        })
    }
    update(id: number, data: UpdateBudgetDto[] | UpdateBudgetDto): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            if (data instanceof Array) {
                const updateUserOperations = data.map(({ id, userId, categories, ...rest }) => {
                    if (rest.repeat === "NEVER") {
                        rest.active = false
                        rest.next_date = null
                    }
                    return BaseDatasource.prisma.budget.update({
                        where: { id },
                        data: rest
                    })
                })
                const action = await BaseDatasource.prisma.$transaction(updateUserOperations)
                action.forEach(data => {
                    this.auditSave(data.id, data, "UPDATE", data.userId)
                })
                return "Budget updated successfully"
            } else {
                const getOne = await this.getOne(id, data.userId!)
                if (getOne instanceof CustomResponse) {
                    return getOne
                } else {
                    if (data.limit_amount) {
                        if (data.limit_amount! < getOne.limit_amount) {
                            return new CustomResponse("Limit amount should be greater or equal to the current amount", 400)
                        }
                    }
                    const budget = await BaseDatasource.prisma.budget.updateMany({
                        where: {
                            id,
                            userId: data.userId,
                            active: true
                        },
                        data
                    })
                    console.log("aaaaaa", budget);
                    if (budget.count === 0) return new CustomResponse("Budget not found", 404)
                    this.auditSave(id, data, "UPDATE", data.userId!)
                    return "Budget update successfully"
                }
            }
        })
    }

    updateAmounts(userId: string, data: UpdateBudgetDto, budgetId: number): Promise<boolean | CustomResponse> {
        return this.handleErrors(async () => {
            console.log("AA", data);
            const budget = await BaseDatasource.prisma.budget.update({
                where: {
                    id: budgetId,
                    userId,
                    deleted_at: null,
                },
                data
            })
            console.log("TODO BIEN");
            return true
        })
    }
    getOne(id: number, userId: string): Promise<BudgetEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const budget = await BaseDatasource.prisma.budget.findFirst({
                where: {
                    AND: [
                        { id },
                        { deleted_at: null },
                        { userId }
                    ]
                }
            })
            if (!budget) return new CustomResponse("Budget not found", 404)
            return BudgetEntity.fromObject(budget)
        })
    }
    getAll(userId: string): Promise<BudgetEntity[] | CustomResponse> {
        return this.handleErrors(async () => {
            // await this.transactionByWallet(userId)
            await this.getAllTransactionToBeDeactive()
            const budgets = await BaseDatasource.prisma.budget.findMany({
                where: {
                    userId,
                    deleted_at: null,
                    active: true
                },
                include: {
                    BudgetCategories: {
                        include: {
                            category: true
                        }
                    }
                }
            })
            console.log(JSON.stringify(budgets));
            return budgets.map(budget => BudgetEntity.fromObject(budget))
        })
    }
    create(data: CreateBudgetDto): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            let { categories, ...rest } = data
            if (rest.repeat !== "NEVER") {
                const { categories, ...info } = calculateNextDateToBudget(data)
                rest = info
            }
            const new_budget = await BaseDatasource.prisma.budget.create({
                data: {
                    ...rest,
                }
            })
            const budgetCategories = categories.split(",")
            if (budgetCategories.length >= 1) {
                for (const category of budgetCategories) {
                    await BaseDatasource.prisma.budgetCategory.create({
                        data: {
                            categoryId: +category,
                            budgetId: new_budget.id
                        }
                    })
                }
            }
            await this.auditSave(new_budget.id, new_budget, "CREATE", new_budget.userId)
            return "budget created successfully"
        })
    }

    createMany(data: CreateBudgetDto[]): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            if (data instanceof Array) {
                data.map(async (budget) => {
                    const { categories, ...rest } = budget
                    const new_budget = await BaseDatasource.prisma.budget.create({ data: rest })
                    const budgetCategories = budget.categories.split(",")
                    if (budgetCategories.length >= 1) {
                        for (const category of budgetCategories) {
                            await BaseDatasource.prisma.budgetCategory.create({
                                data: {
                                    categoryId: +category,
                                    budgetId: new_budget.id
                                }
                            })
                        }
                    }
                })
            }
            return "Budget created successfully"
        })
    }

    get_one_by_date(walletid: number, categoryid: number[], userid: string, date: Date): Promise<BudgetEntity[] | CustomResponse> {
        return this.handleErrors(async () => {
            const budgets = await BaseDatasource.prisma.budget.findMany({
                where: {
                    deleted_at: null,        // No eliminados
                    active: true,            // Presupuestos activos
                    userId: userid,          // Filtrar por usuario
                    walletId: walletid,      // Filtrar por billetera (si aplica)
                    date: { lte: date },     // Fecha de inicio menor o igual a la fecha de la transacción
                    end_date: { gte: date }, // Fecha de fin mayor o igual a la fecha de la transacción
                    BudgetCategories: {
                        some: {
                            categoryId: { in: categoryid }, // Categorías asociadas
                        },
                    },
                },
                include: {
                    BudgetCategories: true, // Incluir las categorías relacionadas
                },
            });

            return budgets.map(budget => BudgetEntity.fromObject(budget));
        });
    }


    getAllTransactionToBeDeactive(): Promise<BudgetEntity[] | CustomResponse> {
        return this.handleErrors(async () => {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            const budgets = await BaseDatasource.prisma.budget.findMany({
                where: {
                    deleted_at: null,
                    end_date: { lt: today },
                    active: true,
                    repeat: "NEVER",
                },
            })
            return budgets.map(budget => BudgetEntity.fromObject(budget))
        })
    }

    // return all transactions associated with the specified budget
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

}
