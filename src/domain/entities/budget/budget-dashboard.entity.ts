export class BudgetDashboardEntity {
    constructor(
        public name: string,
        public repeat: string,
        public limit_amount: number,
        public current_amount: number,
        public percentage: number,
        public categories: { name: string, color: string }[], // Cambiado a un arreglo
    ) { }

    public static fromObject(obj: { [key: string]: any }): BudgetDashboardEntity {
        return new BudgetDashboardEntity(
            obj.name,
            obj.repeat,
            obj.limit_amount,
            obj.current_amount,
            obj.percentage,
            obj.categories
        );
    }
}