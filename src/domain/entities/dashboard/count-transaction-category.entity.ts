export class CountTransactionCategoryEntity {
    constructor(
        private name: string,
        private transactionCount: number,
        private color: string
    ) { }

    public static fromObject(obj: { [key: string]: any }): CountTransactionCategoryEntity {
        return new CountTransactionCategoryEntity(
            obj.name,
            obj.transactionCount,
            obj.color,
        );
    }
}