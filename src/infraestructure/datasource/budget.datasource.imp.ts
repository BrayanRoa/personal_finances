import { BudgetDatasource } from "../../domain/datasources/budget.datasource";
import { CreateBudgetDto } from "../../domain/dtos/budget/create-budget.dto";
import { UpdateBudgetDto } from "../../domain/dtos/budget/update-budget.dto";
import { BudgetEntity } from "../../domain/entities/budget/budget.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";

export class BudgetDatasourceImp extends BaseDatasource implements BudgetDatasource {

    constructor() {
        super()
        this.audit_class = "BUDGET"
    }
    update(id: number, data: UpdateBudgetDto, user_audits: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const budget = await BaseDatasource.prisma.budget.updateMany({
                where: {
                    id,
                    userId: data.userId
                },
                data
            })
            if (budget.count === 0) return new CustomResponse("Budget not found", 404)
            this.auditSave(id, data, "UPDATE", user_audits)
            return "Budget updated successfully"
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
    create(data: CreateBudgetDto, user_audits: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const { categories, wallets, ...rest } = data
            const new_budget = await BaseDatasource.prisma.budget.create({
                data: {
                    ...rest,
                }
            })
            const budgetCategories = data.categories.split(",")
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
            const budgetWallets = data.wallets.split(",")
            if (budgetWallets.length >= 1) {
                for (const wallet of budgetWallets) {
                    console.log(wallet);
                    await BaseDatasource.prisma.budgetWallet.create({
                        data: {
                            walletId: +wallet,
                            budgetId: new_budget.id
                        }
                    })
                }
            }
            await this.auditSave(new_budget.id, new_budget, "CREATE", user_audits)
            return "budget created successfully"
        })
    }

    get_one_by_date(walletid: number, categoryid: number, userid: string): Promise<BudgetEntity[] | CustomResponse> {
        console.log({walletid}, {categoryid}, {userid});
        return this.handleErrors(async () => {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            const budgets = await BaseDatasource.prisma.budget.findMany({
                where: {
                    deleted_at: null,
                    initial_date: { lte: today },
                    end_date: { gte: today },
                    userId: userid,
                    BudgetCategories: {
                        some: { categoryId: categoryid }
                    },
                    BudgetWallet: {
                        some: { walletId: walletid }
                    }
                },
                include: {
                    BudgetCategories: true,
                    BudgetWallet: true
                }
            })
            console.log(budgets);
            return budgets.map(budget => BudgetEntity.fromObject(budget))
        })
    }

}
