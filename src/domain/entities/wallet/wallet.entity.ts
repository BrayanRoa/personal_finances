import { BaseEntity } from "../../../utils/entity/base.entity";
import { TransactionEntity } from "../transaction/transaction.entity";

export class WalletEntity extends BaseEntity {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public userId: number,
        public created_at: Date,
        public updated_at: Date,
        public transactions?: TransactionEntity[],
        public deleted_at?: Date,
    ) {
        super(id, created_at, updated_at, deleted_at)
    }

    public static fromObject(obj: { [key: string]: any }): WalletEntity {
        return new WalletEntity(
            obj.id,
            obj.name,
            obj.description,
            obj.userId,
            obj.created_at,
            obj.updated_at,
            obj.transactions,
            obj.deleted_at
        );
    }
}