
export class BaseEntity {


    constructor(
        public id: string | number, 
        public created_at: Date | null,
        public updated_at: Date | null,
        public deleted_at?: Date | null,
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