import { BaseEntity } from "../../../utils/entity/base.entity";
import { TransactionEntity } from "../transaction/transaction.entity";
import { BudgetEntity } from "./budget.entity";


export class BudgetTransactionEntity extends BaseEntity {
    constructor(
        public id: number,
        public transactionId: number,
        public budgetId: number,
        public budget: BudgetEntity,
        public transaction: TransactionEntity,
        public created_at: Date,
        public updated_at: Date,
        public deleted_at?: Date,
    ) {
        super(id, created_at, updated_at, deleted_at);
    }

    public static fromObject(obj: { [key: string]: any }): BudgetTransactionEntity {
        return new BudgetTransactionEntity(
            obj.id,
            obj.transactionId,
            obj.budgetId,
            obj.budget,
            obj.transaction,
            obj.created_at,
            obj.updated_at,
            obj.deleted_at
        );
    }
}