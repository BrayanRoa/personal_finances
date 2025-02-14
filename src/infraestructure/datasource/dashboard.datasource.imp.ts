import { DashboardDatasource } from "../../domain/datasources/dashboard.datasource";
import { SummaryWalletEntity } from "../../domain/entities/dashboard/summary-wallets.entity";
import { CountTransactionCategoryEntity } from "../../domain/entities/dashboard/count-transaction-category.entity";
import { TransactionMonthEntity } from "../../domain/entities/dashboard/transaction-months.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";
import { BudgetDashboardEntity } from "../../domain/entities/budget/budget-dashboard.entity";
import { budgetInterface } from "../../utils/interfaces/response_paginate";

export class DashboardDatasourceImp extends BaseDatasource implements DashboardDatasource {

    now: Date = new Date()
    startDate = new Date(Date.UTC(this.now.getUTCFullYear(), this.now.getUTCMonth(), 1));
    endDate = new Date(Date.UTC(this.now.getUTCFullYear(), this.now.getUTCMonth() + 1, 0, 23, 59, 59));

    constructor() {
        super();
        this.audit_class = "DASHBOARD";
    }
    summaryWalletsCards(userId: string): Promise<CustomResponse | SummaryWalletEntity> {

        return this.handleErrors(async () => {
            const { totalIncome, totalExpenses } = await this.totalIncomesAndOutfllows(userId)
            const budgetsActives = await this.activeBudgets(userId)
            // const totalTransactions = await this.totalTransactions(userId) // del mes actual

            this.summaryTransactionsByMonth(userId, 2024)
            return SummaryWalletEntity.fromObject(
                { totalIncome, totalExpenses, budgetsActives }
            )
        })
    }

    private async totalIncomesAndOutfllows(userId: string) {
        const baseCondition = {
            AND: [
                { deleted_at: null },
                { userId: userId },
                { wallet: { deleted_at: null } },
            ],
        }
        const [expenses, income] = await Promise.all([
            BaseDatasource.prisma.transaction.aggregate({
                _sum: {
                    amount: true
                },
                where: { ...baseCondition, type: "OUTFLOW" },
            }),
            BaseDatasource.prisma.transaction.aggregate({
                _sum: {
                    amount: true
                },
                where: { ...baseCondition, type: "INCOME" },
            })
        ])
        return {
            totalIncome: income._sum.amount ? income._sum.amount : 0,
            totalExpenses: expenses._sum.amount ? expenses._sum.amount : 0,
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

    // the application does not use it
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
                join "Wallet" w on w.id = t."walletId"
                WHERE 
                    t.deleted_at IS NULL and             -- Ignorar registros eliminados
                    EXTRACT(YEAR FROM t.date) = ${year} and
                    t."userId" = ${userId} AND       -- Filtrar por usuario
                    w.deleted_at IS NULL 
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
            const data: CountTransactionCategoryEntity[] = await BaseDatasource.prisma.$queryRaw`
                select c."name" as name, count(t.id) as transactioncount, i."path" as "icon", cl."hex" as color from "Transaction" t
                join 
                    "Wallet" w on w.id = t."walletId" 
                join 
                    "Category" c on c.id = t."categoryId" 
                join 
                    "Color" cl on cl.id = c."colorId"
                join 
                    "Icon" i on i.id = c."iconId"
                where 
                    t.deleted_at is null and 
                    w.deleted_at is null and 
                    t."userId" = ${userId}
                group by 
                    c.name, i."path", cl."hex"
            `;
            return data.map((category) => {
                return {
                    name: category.name,
                    transactioncount: typeof category.transactioncount === 'bigint'
                        ? Number(category.transactioncount)  // Convierte BigInt a Number
                        : category.transactioncount,        // Mantén el valor si ya es un número
                    color: category.color,
                    icon: category.icon
                };
            });
        });
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
                    color: ""
                }))
            ));

            return {
                budgets,
                meta: this.calculateMeta(totalRecords, per_page, page)
            };
        })
    }
}