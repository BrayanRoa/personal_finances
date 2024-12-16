import { CustomResponse } from "../../../utils/response/custom.response";
import { SummaryWalletEntity } from "../../entities/dashboard/summary-wallets.entity";
import { TransactionMonthEntity } from "../../entities/dashboard/transaction-months.entity";
import { DasbboardRepository } from "../../repositories/dashboard.repository";

export interface summaryTransactionsMonthUseCase {
    execute(userId: string, year: number): Promise<CustomResponse | TransactionMonthEntity[]>;
}

export class SummaryTransactionsMonth implements summaryTransactionsMonthUseCase {
    types: ('INCOME' | 'OUTFLOW')[] = ['INCOME', 'OUTFLOW'];
    constructor(
        private repository: DasbboardRepository,
    ) {

    }
    async execute(userId: string, year: number): Promise<CustomResponse | TransactionMonthEntity[]> {
        const data = await this.repository.summaryTransactionsByMonth(userId, year)

        if (Array.isArray(data)) {
            return this.addMissingMonths(data, year.toString());
        }
        return data
    }

    addMissingMonths = (transactions: TransactionMonthEntity[], year: string): TransactionMonthEntity[] => {
        const allMonths = this.generateYearMonths(year);
        
        return allMonths.flatMap((month) =>
            this.types.map((type) => {
                const exists = transactions.some((t) => t.month === month && t.type === type);

                return exists
                    ? transactions.find((t) => t.month === month && t.type === type)!
                    : { month, type, total: 0 };
            })
        );
    };

    generateYearMonths = (year: string): string[] => {
        return Array.from({ length: 12 }, (_, i) => `${year}-${(i + 1).toString().padStart(2, '0')}`);
    };

}