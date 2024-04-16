import { BaseEntity } from "../../../utils/entity/base.entity";

export class UserEntity extends BaseEntity {

    constructor(
        public id: string,
        public name: string,
        public email: string,
        public email_sent: boolean,
        public emailValidated : boolean,
        public created_at: Date,
        public updated_at: Date,
        public deleted_at?: Date,
        public password?: string,
    ) {
        super(id, created_at, updated_at, deleted_at)
    }

    public static fromObject(obj: { [key: string]: any }): UserEntity {
        return new UserEntity(
            obj.id,
            obj.name,
            obj.email,
            obj.email_sent,
            obj.emailValidated,
            obj.created_at,
            obj.updated_at,
            obj.deleted_at,
            obj.password
        )
    }

}