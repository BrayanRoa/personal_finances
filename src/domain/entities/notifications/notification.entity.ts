import { BaseEntity } from "../../../utils/entity/base.entity";

export class NotificationEntity extends BaseEntity {

    constructor(
        public id: string,
        public message: string,
        public title: string,
        public read: boolean,
        public userId: string,
        public created_at: Date,
        public updated_at: Date,
        public deleted_at?: Date,
    ) {
        super(id, created_at, updated_at, deleted_at)
    }

    public static fromObject(obj: { [key: string]: any }): NotificationEntity {
        return new NotificationEntity(
            obj.id,
            obj.message,
            obj.title,
            obj.read,
            obj.userId,
            obj.created_at,
            obj.updated_at,
            obj.deleted_at
        )
    }

}