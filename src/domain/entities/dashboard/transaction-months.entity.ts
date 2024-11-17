export class TransactionMonthEntity {
    constructor(
        public month:string,
        public type:string,
        public total:number,
    ) { }

    public static fromObject(obj: { [key: string]: any }): TransactionMonthEntity {
        return new TransactionMonthEntity(
            obj.month,
            obj.type,
            obj.total,
        );
    }
}