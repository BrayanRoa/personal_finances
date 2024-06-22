import { BaseEntity } from "../../../utils/entity/base.entity";

export class BudgetEntity extends BaseEntity {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public initial_date: Date,
        public end_date: Date,
        public amount: number,
        public userId: string,
        public created_at: Date,
        public updated_at: Date,
        public deleted_at?: Date,
    ) {
        super(id, created_at, updated_at, deleted_at);
    }

    public static fromObject(obj: { [key: string]: any }): BudgetEntity {
        return new BudgetEntity(
            obj.id,
            obj.name,
            obj.description,
            obj.initial_date,
            obj.end_date,
            obj.amount,
            obj.userId,
            obj.created_at,
            obj.updated_at,
            obj.deleted_at
        );
    }
}