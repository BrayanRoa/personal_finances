import { BaseEntity } from "../../../utils/entity/base.entity";
import { CategoryEntity } from "../category/category.entity";
import { WalletEntity } from "../wallet/wallet.entity";

export class TransactionEntity extends BaseEntity {

    constructor(
        public id: number,
        public date: Date,
        public amount: number,
        public description: string,
        public name:string,
        public type: string,
        public repeat: string,
        public userId: string,
        public walletId: number,
        public categoryId: number,
        public active: boolean,
        public next_date: Date,
        public wallet:WalletEntity,
        public category:CategoryEntity,
        public created_at: Date,
        public updated_at: Date,
        public deleted_at?: Date
    ) {
        super(id, created_at, updated_at, deleted_at);
    }

    public static fromObject(obj: { [key: string]: any }): TransactionEntity {
        return new TransactionEntity(
            obj.id,
            obj.date,
            +obj.amount,
            obj.description,
            obj.name,
            obj.type,
            obj.repeat,
            obj.userId,
            obj.walletId,
            obj.categoryId,
            obj.active,
            obj.next_date,
            obj.wallet,
            obj.category,
            obj.created_at,
            obj.updated_at,
            obj.deleted_at
        )
    }
}