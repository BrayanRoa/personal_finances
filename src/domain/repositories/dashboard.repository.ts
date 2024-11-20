import { CustomResponse } from "../../utils/response/custom.response";
import { SummaryWalletEntity } from "../entities/dashboard/summary-wallets.entity";
import { CountTransactionCategoryEntity } from "../entities/dashboard/count-transaction-category.entity";
import { TransactionMonthEntity } from "../entities/dashboard/transaction-months.entity";
import { BudgetDashboardEntity } from "../entities/budget/budget-dashboard.entity";
import { budgetInterface } from "../../utils/interfaces/response_paginate";

export abstract class DasbboardRepository{

    // informacion del header, para las cards
    abstract summaryWallets(userId: string): Promise<CustomResponse | SummaryWalletEntity>;

    // grafico de barras de los 12 meses
    abstract summaryTransactionsByMonth(userId: string, year:number): Promise<CustomResponse | TransactionMonthEntity[]>;

    abstract summaryTransactionsByCategory(userId: string): Promise<CustomResponse | CountTransactionCategoryEntity[]>;

    // tabla con informacion de cada banco
    abstract banksInformation(user:string): Promise<CustomResponse>

    // tabla con informacion de cada budget
    abstract summarybudgetsInformation(page:number, per_page:number,user:string): Promise<CustomResponse | budgetInterface>


}