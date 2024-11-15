import { BaseEntity } from "../../../utils/entity/base.entity";

export class SummaryWalletEntity {
    constructor(
        private totalIncome:number,
        private totalExpenses:number,
        private budgetsActives:number,
        private totalTransactions:number,
    ) { }

    public static fromObject(obj: { [key: string]: any }): SummaryWalletEntity {
        return new SummaryWalletEntity(
            obj.totalIncome,
            obj.totalExpenses,
            obj.budgetsActives,
            obj.totalTransactions,
        );
    }
}