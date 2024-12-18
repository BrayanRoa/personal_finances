// sum of all incomes and expenses of the each wallet
export interface IncomesAndExpensesByWallet {
    name: string, type: string, total: number
}

export interface IMonthlyBalanceByWallet {
    name: string, month: string, balance: number
}