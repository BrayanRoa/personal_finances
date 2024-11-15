import { DashboardDatasource } from "../../domain/datasources/dashboard.datasource";
import { SummaryWalletEntity } from "../../domain/entities/dashboard/summary-wallets.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";

export class DashboardDatasourceImp extends BaseDatasource implements DashboardDatasource {

    now: Date = new Date()
    startDate = new Date(Date.UTC(this.now.getUTCFullYear(), this.now.getUTCMonth(), 1));
    endDate = new Date(Date.UTC(this.now.getUTCFullYear(), this.now.getUTCMonth() + 1, 0, 23, 59, 59));

    constructor() {
        super();
        this.audit_class = "DASHBOARD";
    }
    summaryWallets(userId: string): Promise<CustomResponse | SummaryWalletEntity> {

        return this.handleErrors(async () => {
            const { totalIncome, totalExpenses } = await this.totalIncomesAndOutfllows(userId)
            const budgetsActives = await this.activeBudgets(userId)
            const totalTransactions = await this.totalTransactions(userId) // del mes actual

            return SummaryWalletEntity.fromObject(
                { totalIncome, totalExpenses, budgetsActives, totalTransactions }
            )
        })
    }

    private async totalIncomesAndOutfllows(userId: string) {
        const baseCondition = {
            AND: [
                {
                    deleted_at: null,
                    userId: userId,
                }
            ],
        }
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

        return {
            totalIncome: income._sum.amount ? income._sum.amount.toNumber() : 0,
            totalExpenses: expenses._sum.amount ? expenses._sum.amount.toNumber() : 0,
        }
    }

    private async activeBudgets(userId: string): Promise<number> {
        return await BaseDatasource.prisma.budget.count({
            where: {
                AND: [
                    { deleted_at: null },
                    { userId },
                    { active: true },
                ]
            }
        })
    }

    private async totalTransactions(userId: string): Promise<number> {
        return await BaseDatasource.prisma.transaction.count({
            where: {
                AND: [
                    { deleted_at: null },
                    { userId },
                    { date: { gte: this.startDate, lt:this.endDate } }
                ]
            }
        })
    }
    summaryTransactionsByMonth(userId: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
    }
    summaryTransactionsByCategory(userId: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
    }
    banksInformation(user: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
    }
    budgetsInformation(user: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
    }
}