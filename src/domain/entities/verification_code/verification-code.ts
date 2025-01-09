import { BaseEntity } from "../../../utils/entity/base.entity";

export class VerificationCodeEntity extends BaseEntity {

    constructor(
        public id: number,
        public code: string,
        public expired_at: Date,
        public active: boolean,
        public used: boolean,
        public created_at: Date,
        public updated_at: Date,
        public deleted_at?: Date,
    ) {
        super(id, created_at, updated_at, deleted_at)
    }

    public static fromObject(obj: { [key: string]: any }): VerificationCodeEntity {
        return new VerificationCodeEntity(
            obj.id,
            obj.code,
            obj.expired_at,
            obj.active,
            obj.used,
            obj.created_at,
            obj.updated_at,
            obj.deleted_at,
        )
    }

}