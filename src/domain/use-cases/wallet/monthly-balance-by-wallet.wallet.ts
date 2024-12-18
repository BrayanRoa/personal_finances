import { CustomResponse } from "../../../utils/response/custom.response";
import { IMonthlyBalanceByWallet } from "../../interfaces/wallets/wallets.interface";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface MonthlyBalanceByWalletUseCase {
    execute(userId: string, year: number): Promise<CustomResponse | Record<string, IMonthlyBalanceByWallet[]>>
}


export class MonthlyBalanceByWallet implements MonthlyBalanceByWalletUseCase {

    constructor(
        private repository: WalletRepository
    ) { }
    async execute(userId: string, year: number): Promise<CustomResponse | Record<string, IMonthlyBalanceByWallet[]>> {
        const data = await this.repository.monthlyBalanceByWallet(userId, year);
        if (Array.isArray(data)) {
            const groupBankData = this.groupByBank(data)
            const allMonths = this.generateYearMonths(year.toString());

            Object.entries(groupBankData).forEach(([bankName, transactions]) => {
                // Iterar por todos los meses posibles (de enero a diciembre)
                allMonths.forEach((month) => {
                    const exists = transactions.some((t) => t.month === month);

                    // Si no existe el mes en las transacciones, agregarlo con un balance de 0
                    if (!exists) {
                        transactions.push({
                            month,
                            name: bankName,
                            balance: 0,
                        });
                    }
                });
            });
            return groupBankData
        }
        return data
    }

    // AGRUPA LOS BANCOS DE ESTA MANERA
    // {
    //     "BANCOLOMBIA": [
    //         { "month": "2024-12", "name": "BANCOLOMBIA", "balance": 2850000.0 }
    //     ],
    //     ],
    //     "DAVIVIENDA": [
    //         { "month": "2024-12", "name": "DAVIVIENDA", "balance": 2980000.0 },
    //         { "month": "2024-11", "name": "DAVIVIENDA", "balance": -100000.0 }
    //     ],
    // }
    groupByBank(transactions: { month: string; name: string; balance: number }[]): Record<string, typeof transactions> {
        return transactions.reduce((groups, transaction) => {
            const bank = transaction.name; // Nombre del banco
            if (!groups[bank]) {
                groups[bank] = []; // Si no existe el banco, inicializa un array
            }
            groups[bank].push(transaction); // Agrega la transacción al banco correspondiente
            return groups;
        }, {} as Record<string, typeof transactions>);
    }

    generateYearMonths = (year: string): string[] => {
        return Array.from({ length: 12 }, (_, i) => `${year}-${(i + 1).toString().padStart(2, '0')}`);
    };

}