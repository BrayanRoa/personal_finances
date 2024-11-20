import { DashboardDatasource } from "../../domain/datasources/dashboard.datasource";
import { SummaryWalletEntity } from "../../domain/entities/dashboard/summary-wallets.entity";
import { CountTransactionCategoryEntity } from "../../domain/entities/dashboard/count-transaction-category.entity";
import { TransactionMonthEntity } from "../../domain/entities/dashboard/transaction-months.entity";
import { DasbboardRepository } from "../../domain/repositories/dashboard.repository";
import { CustomResponse } from "../../utils/response/custom.response";
import { BudgetEntity } from "../../domain/entities/budget/budget.entity";
import { BudgetDashboardEntity } from "../../domain/entities/budget/budget-dashboard.entity";
import { budgetInterface } from "../../utils/interfaces/response_paginate";

export class DashboardRepositoryImpl implements DasbboardRepository {

    constructor(
        private readonly dashboardDatasource: DashboardDatasource
    ) { }
    summaryWallets(userId: string): Promise<CustomResponse | SummaryWalletEntity> {
        return this.dashboardDatasource.summaryWallets(userId)
    }
    summaryTransactionsByMonth(userId: string, year: number): Promise<CustomResponse | TransactionMonthEntity[]> {
        return this.dashboardDatasource.summaryTransactionsByMonth(userId, year)
    }
    summaryTransactionsByCategory(userId: string): Promise<CustomResponse | CountTransactionCategoryEntity[]> {
        return this.dashboardDatasource.summaryTransactionsByCategory(userId)
    }
    banksInformation(user: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
    }
    summarybudgetsInformation(page:number, per_page:number, user: string): Promise<CustomResponse | budgetInterface> {
        return this.dashboardDatasource.summarybudgetsInformation(page, per_page, user);
    }

}