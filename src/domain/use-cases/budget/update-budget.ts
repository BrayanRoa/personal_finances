import { CustomResponse } from "../../../utils/response/custom.response";
import { UpdateBudgetDto } from "../../dtos/budget/update-budget.dto";
import { BudgetRepository } from "../../repositories/budget.repository";

export interface UpdateBudgetUseCase {
    execute(id: number, dto: UpdateBudgetDto): Promise<string | CustomResponse>;
}


export class UpdateBudget implements UpdateBudgetUseCase {

    constructor(
        private repository: BudgetRepository
    ) { }
    async execute(id: number, dto: UpdateBudgetDto): Promise<string | CustomResponse> {

        const { categories, date, end_date } = dto

        let numArray
        // Asegurarte de que es un string antes de usar `split`
        if (typeof categories === 'string') {
            numArray = categories.split(',').map(Number); // Convierte el string en un array de números
            const transactions = await this.repository.transactionByBudget(1, 10, dto.userId!, numArray, date!, end_date!)

            if (transactions instanceof CustomResponse) {
                return transactions
            }

            // cada vez que se actualiza un budget actualiazo la informacion general del mismo para mantener los cambios al día
            dto.current_amount = transactions.transactions.reduce((acc, curr) => acc + curr.amount, 0)
            dto.percentage = (dto.current_amount / dto.limit_amount!) * 100
        }
        const update = await this.repository.update(id, dto)
        return update
    }
}