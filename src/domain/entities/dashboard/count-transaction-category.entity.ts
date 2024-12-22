export class CountTransactionCategoryEntity {
    constructor(
        public name: string,
        public transactioncount: number,
        public color: string
    ) { }

    public static fromObject(obj: { [key: string]: any }): CountTransactionCategoryEntity {
        return new CountTransactionCategoryEntity(
            obj.name,
            obj.transactioncount,
            obj.color,
        );
    }
}