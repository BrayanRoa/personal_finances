import { CustomResponse } from "../../../utils/response/custom.response";
import { UpdateBudgetDto } from "../../dtos/budget/update-budget.dto";
import { BudgetRepository } from "../../repositories/budget.repository";
import { TransactionRepository } from "../../repositories/transaction.repository";

export interface UpdateBudgetUseCase {
    execute(id: number, dto: UpdateBudgetDto): Promise<string | CustomResponse>;
}


export class UpdateBudget implements UpdateBudgetUseCase {

    constructor(
        private repository: BudgetRepository,
        private transaction: TransactionRepository
    ) { }
    async execute(id: number, dto: UpdateBudgetDto): Promise<string | CustomResponse> {
        const { categories, date, end_date, userId } = dto;

        // Validación temprana
        if (!categories || typeof categories !== 'string') {
            return new CustomResponse('Invalid categories format', 400);
        }

        if (!userId || !date || !end_date) {
            return new CustomResponse('Missing required fields', 400);
        }

        // Convertir categorías a array de números
        const numArray = categories.split(',').map(Number).filter(n => !isNaN(n));

        try {
            // Actualizar presupuesto
            const update = await this.repository.update(id, dto);
            if (update instanceof CustomResponse) {
                return update;
            }

            // Procesar transacciones por categoría
            for (const categoryId of numArray) {
                const transactions = await this.transaction.transactionByDate(userId, date, end_date, categoryId);
                if (!(transactions instanceof CustomResponse)) {
                    for (const transaction of transactions) {
                        await this.transaction.createTransactionBudget(update.id!, transaction.id);
                    }
                }
            }

            // Obtener categorías relacionadas al presupuesto
            const budgetCategories = await this.repository.getManyBudgetCategory(update.id);
            if (budgetCategories instanceof CustomResponse) {
                return budgetCategories;
            }

            // Buscar todas las transacciones relacionadas con el presupuesto
            const budgetTransactions = await this.transaction.getAllTransactionBudget(update.id);
            if (budgetTransactions instanceof CustomResponse) {
                return budgetTransactions;
            }

            // Marcar transacciones como eliminadas si no pertenecen a las categorías actuales
            for (const register of budgetTransactions) {
                if (!numArray.includes(register.transaction.categoryId)) {
                    await this.transaction.markBudgetTransactionAsDeleted(register.budgetId, register.transactionId);
                }
            }

            return "Budget update successfully";
        } catch (error) {
            console.error('Error updating budget:', error);
            return new CustomResponse('An error occurred while updating the budget', 400);
        }
    }

}