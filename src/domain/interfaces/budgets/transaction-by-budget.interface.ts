export interface IGetAllBudgets {
    id:number;
    name: string;
    date: Date;
    end_date: Date;
    limit_amount: number;
    current_amount: number;
    categories: string
}

export interface Category {
    name: string;
    BudgetCategories: BudgetCategory[];
}

export interface BudgetCategory {
    budget: Budget;
}

export interface Budget {
    Wallet: Wallet;
}

export interface Wallet {
    name: string;
}
