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
    // update(id: number, data: UpdateBudgetDto[] | UpdateBudgetDto): Promise<string | CustomResponse> {
    //     return this.handleErrors(async () => {
    //         if (data instanceof Array) {
    //             const updateUserOperations = data.map(({ id, userId, categories, ...rest }) => {
    //                 if (rest.repeat === "NEVER") {
    //                     rest.active = false
    //                     rest.next_date = null
    //                 }
    //                 return BaseDatasource.prisma.budget.update({
    //                     where: { id },
    //                     data: rest
    //                 })
    //             })
    //             const action = await BaseDatasource.prisma.$transaction(updateUserOperations)
    //             action.forEach(data => {
    //                 this.auditSave(data.id, data, "UPDATE", data.userId)
    //             })
    //             return "Budget updated successfully"
    //         } else {
    //             const getOne = await this.getOne(id, data.userId!)
    //             if (getOne instanceof CustomResponse) {
    //                 return getOne
    //             } else {
    //                 if (data.limit_amount) {
    //                     if (data.limit_amount! < getOne.limit_amount) {
    //                         return new CustomResponse("Limit amount should be greater or equal to the current amount", 400)
    //                     }
    //                 }
    //                 const budget = await BaseDatasource.prisma.budget.updateMany({
    //                     where: {
    //                         id,
    //                         userId: data.userId,
    //                         active: true
    //                     },
    //                     data
    //                 })
    //                 console.log("aaaaaa", budget);
    //                 if (budget.count === 0) return new CustomResponse("Budget not found", 404)
    //                 this.auditSave(id, data, "UPDATE", data.userId!)
    //                 return "Budget update successfully"
    //             }
    //         }
    //     })
    // }

    update(id: number, data: UpdateBudgetDto): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const getOne = await this.getOne(id, data.userId!);

            const { categories, ...info } = data

            if (getOne instanceof CustomResponse) {
                return getOne
            }

            if (info.date !== getOne.date || info.repeat !== getOne.repeat) {
                if (info.repeat !== "NEVER") {
                    info.next_date = calculateNextDateToBudget(info.date!, info.repeat || getOne.repeat)
                    info.end_date = new Date(info.next_date.getTime() - 1)
                    info.date = new Date(info.date!)
                }

            }
            await BaseDatasource.prisma.budget.update({
                where: { id },
                data: {
                    ...info,
                }
            })

            if (categories) {
                // Convertir las categorías en una lista
                const newCategories = categories.split(',');

                // Obtener las categorías actuales de la tabla intermedia
                const currentBudgetCategories = await this.getManyBudgetCategory(id);

                // Categorías actuales en un formato manejable
                if (currentBudgetCategories instanceof CustomResponse) {
                    return currentBudgetCategories;
                }
                const currentCategoryIds = currentBudgetCategories.map(c => c.categoryId);

                // Determinar categorías a agregar y eliminar
                const categoriesToAdd = newCategories.filter(c => !currentCategoryIds.includes(+c));
                const categoriesToRemove = currentCategoryIds.filter(c => !newCategories.includes(c.toString()));

                // Agregar nuevas categorías
                if (categoriesToAdd.length > 0) {
                    await this.createBudgetCategories(id, categoriesToAdd);
                }

                // Eliminar categorías no seleccionadas
                if (categoriesToRemove.length > 0) {
                    await this.removeBudgetCategories(id, categoriesToRemove);
                }
            }

            return "Budget Updated successfully"
        })
    }

    async updateMany(data: UpdateBudgetDto) {
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
        }
    }

    updateAmounts(userId: string, data: UpdateBudgetDto, budgetId: number): Promise<boolean | CustomResponse> {
        return this.handleErrors(async () => {
            await BaseDatasource.prisma.budget.update({
                where: {
                    id: budgetId,
                    userId,
                    deleted_at: null,
                },
                data
            })
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
                }, include: {
                    BudgetCategories: {
                        include: {
                            category: true
                        }
                    }
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
            return budgets.map(budget => BudgetEntity.fromObject(budget))
        })
    }
    create(data: CreateBudgetDto): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            let { categories, ...rest } = data
            if (rest.repeat !== "NEVER") {
                rest.next_date = calculateNextDateToBudget(rest.date, rest.repeat)
                rest.end_date = new Date(rest.next_date.getTime() - 1)
            }
            const new_budget = await BaseDatasource.prisma.budget.create({
                data: {
                    ...rest,
                }
            })
            const budgetCategories = categories.split(",")
            await this.createBudgetCategories(new_budget.id, budgetCategories)
            await this.auditSave(new_budget.id, new_budget, "CREATE", new_budget.userId)
            return "budget created successfully"
        })
    }

    createBudgetCategories(budgetId: number, idCategories: string[]) {
        return this.handleErrors(async () => {
            for (const category of idCategories) {
                await BaseDatasource.prisma.budgetCategory.create({
                    data: {
                        categoryId: +category,
                        budgetId
                    }
                })
            }
        })
    }

    removeBudgetCategories(budgetId: number, idCategories: number[]) {
        return this.handleErrors(async () => {
            for (const category of idCategories) {
                await BaseDatasource.prisma.budgetCategory.deleteMany({
                    where: {
                        budgetId,
                        categoryId: category
                    }
                })

            }
        })
    }

    getManyBudgetCategory(budgetId: number): Promise<{ budgetId: number, categoryId: number }[] | CustomResponse> {
        return this.handleErrors(async () => {
            const budgetCategories = await BaseDatasource.prisma.budgetCategory.findMany({
                where: {
                    budgetId
                },
            })
            return budgetCategories
        })
    }

    // ! PARECE QUE SE PUEDE BORRAR
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
