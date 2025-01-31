import { BaseEntity } from "../../../utils/entity/base.entity";

export class IconEntity extends BaseEntity {
    constructor(
        public id: string,
        public path: string,
        public created_at: Date,
        public updated_at: Date,
        public deleted_at?: Date,
    ) {
        super(id, created_at, updated_at, deleted_at);
    }

    public static fromObject(obj: { [key: string]: any }): IconEntity {
        return new IconEntity(
            obj.id,
            obj.path,
            obj.created_at,
            obj.updated_at,
            obj.deleted_at
        );
    }
}