import { BaseEntity } from "../../../utils/entity/base.entity";
import { TransactionEntity } from "../transaction/transaction.entity";

export class WalletEntity extends BaseEntity {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public initial_balance: number,
        public incomes: number,
        public expenses: number,
        public main_account: boolean,
        // public active: boolean,
        // public type_wallet: string,
        // public type_account: string,
        public userId: string,
        public created_at: Date | null,
        public updated_at: Date | null,
        public transactions?: TransactionEntity[],
        public deleted_at?: Date | null,
    ) {
        super(id, created_at, updated_at, deleted_at)
    }

    public static fromObject(obj: { [key: string]: any }): WalletEntity {
        return new WalletEntity(
            obj.id,
            obj.name,
            obj.description,
            obj.initial_balance,
            obj.incomes,
            obj.expenses,
            obj.main_account,
            // obj.active,
            // obj.type_account,
            obj.userId,
            obj.created_at,
            obj.updated_at,
            obj.transactions,
            obj.deleted_at
        );
    }
}