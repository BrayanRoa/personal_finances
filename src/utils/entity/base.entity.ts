
export class BaseEntity {


    constructor(
        public id: string, 
        public created_at: Date,
        public updated_at: Date,
        public deleted_at?: Date,
    ) { }

    public static fromObject(obj: { [key: string]: any }): BaseEntity {
        return new BaseEntity(
            obj.id,
            obj.created_at,
            obj.updated_at,
            obj.deleted_at
        )
    }
} 