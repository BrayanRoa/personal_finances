import { BaseEntity } from "../../../utils/entity/base.entity";

export class CategoryEntity extends BaseEntity {
    constructor(
        public id: string,
        public name: string,
        public userId: string,
        public color: { hex: string },
        public icon: { path: string },
        public created_at: Date,
        public updated_at: Date,
        public _count?: { Transaction: number },
        public deleted_at?: Date,
    ) {
        super(id, created_at, updated_at, deleted_at);
    }

    public static fromObject(obj: { [key: string]: any }): CategoryEntity {
        return new CategoryEntity(
            obj.id,
            obj.name,
            obj.userId,
            obj.color,
            obj.icon,
            obj.created_at,
            obj.updated_at,
            obj._count ? { Transaction: obj._count.Transaction ?? 0 } : undefined,
            obj.deleted_at
        );
    }

}