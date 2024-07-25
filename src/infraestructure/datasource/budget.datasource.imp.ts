import { PrismaPromise } from "@prisma/client";
import { BudgetDatasource } from "../../domain/datasources/budget.datasource";
import { CreateBudgetDto } from "../../domain/dtos/budget/create-budget.dto";
import { UpdateBudgetDto } from "../../domain/dtos/budget/update-budget.dto";
import { BudgetEntity } from "../../domain/entities/budget/budget.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";
import { calculateNextDateToBudget } from "../../works/processRecurringTransactions";

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
                const getOne = await this.getOne(id, data.userId)
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
                    if (budget.count === 0) return new CustomResponse("Budget not found", 404)
                    this.auditSave(id, data, "UPDATE", data.userId)
                    return "Budget update successfully"
                }
            }
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
            const budgets = await BaseDatasource.prisma.budget.findMany({
                where: {
                    userId,
                    deleted_at: null
                }
            })
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

    get_one_by_date(walletid: number, categoryid: number, userid: string): Promise<BudgetEntity[] | CustomResponse> {
        return this.handleErrors(async () => {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            const budgets = await BaseDatasource.prisma.budget.findMany({
                where: {
                    deleted_at: null,
                    date: { lte: today },
                    next_date: { gte: today },
                    active: true,
                    userId: userid,
                    BudgetCategories: {
                        some: { categoryId: categoryid }
                    },
                },
                include: {
                    BudgetCategories: true,
                }
            })
            return budgets.map(budget => BudgetEntity.fromObject(budget))
        })
    }

}
