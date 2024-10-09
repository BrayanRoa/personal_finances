import { TransactionEntity } from "../../domain/entities";

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
