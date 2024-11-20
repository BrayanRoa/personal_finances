import { TransactionEntity } from "../../domain/entities";
import { BudgetDashboardEntity } from "../../domain/entities/budget/budget-dashboard.entity";
import { BudgetEntity } from "../../domain/entities/budget/budget.entity";

interface GetAllResponse {
    meta:{
        totalRecords: number;
        totalPages: number;
        currentPage: number;
        next_page: boolean;
    }
    // perPage: number;
}

export interface TransactionInterface extends GetAllResponse {
    transactions: TransactionEntity[]
}

export interface DashboardInterface {
    totalIncome:number;
    totalExpenses:number;
    availableAmount: number;
}

export interface budgetInterface extends GetAllResponse{
    budgets: BudgetDashboardEntity[]
}
