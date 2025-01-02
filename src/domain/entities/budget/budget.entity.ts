import { BaseEntity } from "../../../utils/entity/base.entity";



export class BudgetEntity extends BaseEntity {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public date: Date,
        public end_date: Date,
        public limit_amount: number,
        public current_amount: number,
        public percentage: number,
        public active: boolean,
        public next_date: Date,
        public userId: string,
        public categories: string,
        public repeat: string,
        public walletId: number,
        public BudgetCategories: {
            budgetId: number;
            categoryId: number;
        }[],
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
            obj.date,
            obj.end_date,
            obj.limit_amount,
            obj.current_amount,
            obj.percentage,
            obj.active,
            obj.next_date,
            obj.userId,
            obj.categories,
            obj.repeat,
            obj.walletId,
            obj.BudgetCategories,
            obj.created_at,
            obj.updated_at,
            obj.deleted_at
        );
    }
}