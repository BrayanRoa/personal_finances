import { DashboardDatasource } from "../../domain/datasources/dashboard.datasource";
import { SummaryWalletEntity } from "../../domain/entities/dashboard/summary-wallets.entity";
import { CountTransactionCategoryEntity } from "../../domain/entities/dashboard/count-transaction-category.entity";
import { TransactionMonthEntity } from "../../domain/entities/dashboard/transaction-months.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";
import { BudgetDashboardEntity } from "../../domain/entities/budget/budget-dashboard.entity";
import { Prisma } from "@prisma/client";
import { budgetInterface } from "../../utils/interfaces/response_paginate";

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

            this.summaryTransactionsByMonth(userId, 2024)
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
                    { date: { gte: this.startDate, lt: this.endDate } }
                ]
            }
        })
    }
    summaryTransactionsByMonth(userId: string, year: number): Promise<CustomResponse | TransactionMonthEntity[]> {
        return this.handleErrors(async () => {

            const data: SummaryWalletEntity[] = await BaseDatasource.prisma.$queryRaw`
                SELECT 
                TO_CHAR(date, 'YYYY-MM') AS month, -- Formato Año-Mes (YYYY-MM)
                type,                             -- Tipo de transacción (income o outflow)
                SUM(amount) AS total              -- Suma total por tipo y mes
            FROM 
                "Transaction" t 
            WHERE 
                deleted_at IS NULL and             -- Ignorar registros eliminados
                EXTRACT(YEAR FROM date) = ${year} and
                "userId" = ${userId}         -- Filtrar por usuario
            GROUP BY 
                TO_CHAR(date, 'YYYY-MM'),         -- Agrupar por mes
                type                              -- Agrupar por tipo (income o outflow)
            ORDER BY 
                month ASC                        -- Ordenar por mes
                --type ASC;                         -- Ordenar por tipo dentro de cada mes
            `
            return data.map(data => {
                return TransactionMonthEntity.fromObject(data)
            })
        })
    }
    summaryTransactionsByCategory(userId: string): Promise<CustomResponse | CountTransactionCategoryEntity[]> {
        return this.handleErrors(async () => {
            const data = await BaseDatasource.prisma.category.findMany({
                select: {
                    name: true,
                    Transaction: {
                        select: {
                            id: true,
                            wallet: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                        where: {
                            deleted_at: null,
                            // walletId // reemplace `yourWalletId` con la ID de la cartera que está buscando
                        }
                    },
                },
                where: {
                    userId,
                    deleted_at: null
                }
            });
            return data.map(category => {
                const transactionCount = category.Transaction.length;
                return CountTransactionCategoryEntity.fromObject({
                    name: category.name,
                    transactionCount,
                })
            })
            // return categoryCounts
        })
    }
    banksInformation(user: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
    }

    summarybudgetsInformation(page: number, per_page: number, userId: string): Promise<CustomResponse | budgetInterface> {
        return this.handleErrors(async () => {
            let action = [];
            let totalRecords = 0;

            const baseCondition = {
                AND: [
                    {
                        deleted_at: null,
                        userId: userId,
                        active: true,
                    }
                ],
            };
            [totalRecords, action] = await Promise.all([
                BaseDatasource.prisma.budget.count({
                    where: baseCondition
                }),
                BaseDatasource.prisma.budget.findMany({
                    where: baseCondition,
                    include: {
                        BudgetCategories: {
                            include: {
                                category: true,
                            }
                        }
                    },
                    orderBy: { limit_amount: 'desc' },
                    skip: (page - 1) * per_page,
                    take: per_page,
                })
            ]);

            const budgets = action.map(budget => new BudgetDashboardEntity(
                budget.name,
                budget.repeat,
                budget.limit_amount.toNumber(),
                budget.current_amount.toNumber(),
                budget.percentage.toNumber(),
                budget.BudgetCategories.map(item => ({
                    name: item.category.name,
                    color: item.category.color
                }))
            ));

            return {
                budgets,
                meta: this.calculateMeta(totalRecords, per_page, page)
            };
        })
    }
}