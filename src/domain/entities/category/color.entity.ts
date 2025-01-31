import { BaseEntity } from "../../../utils/entity/base.entity";

export class ColorEntity extends BaseEntity {
    constructor(
        public id: string,
        public hex: string,
        public created_at: Date,
        public updated_at: Date,
        public deleted_at?: Date,
    ) {
        super(id, created_at, updated_at, deleted_at);
    }

    public static fromObject(obj: { [key: string]: any }): ColorEntity {
        return new ColorEntity(
            obj.id,
            obj.hex,
            obj.created_at,
            obj.updated_at,
            obj.deleted_at
        );
    }
}