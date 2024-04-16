import { BaseEntity } from "../../../utils/entity/base.entity";

export class AudistsEntity extends BaseEntity {

    constructor(
        public id: string,
        public id_class: string,
        public class_name: string,
        public data: string,
        public type: string,
        public user: string,
        public created_at: Date,
        public updated_at: Date,
        public deleted_at?: Date,
        // public role: string,
    ) {
        super(id, created_at, updated_at, deleted_at)
    }

    public static fromObject(obj: { [key: string]: any }): AudistsEntity {
        return new AudistsEntity(
            obj.id,
            obj.id_class,
            obj.class_name,
            obj.data,
            obj.type,
            obj.user,
            obj.created_at,
            obj.updated_at,
            obj.deleted_at
            // obj.role,
        )
    }

}