// Importaciones: Dependencias externas
import { container } from '../infraestructure/dependencies/container';

// Importaciones: Casos de Uso
import { GetAllTransactionRecurring } from '../domain/use-cases/transaction/get-all-transaction-recurring';
import { CreateTransaction, UpdateTransaction } from '../domain/use-cases';
import { GetAllBudgetsRecurring } from '../domain/use-cases/budget/get-all-budgets-recurring';
import { CreateManyBudget } from '../domain/use-cases/budget/create-many-budgets';
import { BudgetsToBeDeactivated } from '../domain/use-cases/budget/budgets-to-be-deactivated';

// Importaciones: DTOs
import { CreateTransactionDto, UpdateTransactionDto } from '../domain/dtos';
import { UpdateBudgetDto } from '../domain/dtos/budget/update-budget.dto';
import { CreateBudgetDto } from '../domain/dtos/budget/create-budget.dto';

// Importaciones: Utilidades
import { QueryBuilder } from '../utils/query-builder';
import { UpdateManyBudgets } from '../domain/use-cases/budget/update-many-budgets';

// Interfaces
interface BaseInterface {
    id?: number | string;
    userId: string;
    description: string;
    name: string;
    date: Date;
    repeat: string;
    walletId: number;
    next_date: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

interface Transaction extends BaseInterface {
    amount: number;
    type: string;
    categoryId: number;
    active: boolean;
}

// Funciones: Cálculo de Fechas
export function calculateNextDateToTransaction(transaction: Transaction) {
    const { id, created_at, updated_at, deleted_at, ...data } = transaction;

    if (data.next_date) {
        data.date = new Date(data.next_date);
    }

    data.next_date = QueryBuilder.switchTransaction(data.date, data.repeat, true)!;

    return { ...data };
}

export function calculateNextDateToBudget(strat_date: Date, repeat: string) {

    const next_date = QueryBuilder.switchTransaction(strat_date, repeat, true)!;

    return next_date;
}

// Funciones: Operaciones con Transacciones
export const transactionsRecurring = async () => {
    try {
        const transactions = await new GetAllTransactionRecurring(container.cradle.transactionRepository).execute();
        console.log({transactions});
        if (transactions instanceof Array) {
            const modifiedTransactions = transactions.map(calculateNextDateToTransaction);

            if (modifiedTransactions) {
                saveTransactions(modifiedTransactions);
                transactions.forEach(transaction => (transaction.active = false));
                updateTransactions(transactions);
            }

            // TODO: Log de éxito/fallo para transacciones procesadas
            return transactions;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return error;
    }
};

// Funciones: Operaciones con Presupuestos
export const budgetsRecurring = async () => {
    try {
        let budgets = await new GetAllBudgetsRecurring(container.cradle.budgetRepository).execute();

        if (budgets instanceof Array) {

            const updatedBudgets = budgets.map(budget => {
                const newEndDate = QueryBuilder.switchTransaction(budget.next_date, budget.repeat, false)!;

                const { BudgetCategories, id, ...info } = budget
                budget.active = false
                return {
                    ...info,
                    date: budget.next_date, // Fecha de hoy como inicio
                    end_date: newEndDate, // Nueva fecha de fin
                    next_date: new Date(newEndDate.setDate(newEndDate.getDate() + 1)), // Próxima repetición
                };
            });
            await updateBudgets(budgets.map(budgets => {
                const { BudgetCategories, ...info } = budgets
                return info;
            }))
            await saveBudget(updatedBudgets)

            return updatedBudgets;
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return error;
    }
};

// Desactivar presupuestos vencidos
export const budgetsToBeDeactivated = async () => {
    try {
        const budgets = await new BudgetsToBeDeactivated(container.cradle.budgetRepository).execute();

        if (budgets instanceof Array) {
            const data = budgets.map(budget => ({ ...budget, active: false }));
            updateBudgets(data);
        }
    } catch (error) {
        console.error('An error occurred while deactivating budgets:', error);
    }
};

// Funciones: Guardar y Actualizar
const saveTransactions = (transactions: CreateTransactionDto[]) =>
    new CreateTransaction(
        container.cradle.transactionRepository,
        container.cradle.walletRepository,
        container.cradle.budgetRepository,
        container.cradle.emailService
    ).execute(transactions);

const saveBudget = (budgets: CreateBudgetDto[]) =>
    new CreateManyBudget(container.cradle.budgetRepository, container.cradle.walletRepository).execute(budgets);

const updateTransactions = (transactions: UpdateTransactionDto[]) =>
    new UpdateTransaction(container.cradle.transactionRepository, container.cradle.walletRepository, container.cradle.budgetRepository).execute(0, transactions);

const updateBudgets = (budgets: UpdateBudgetDto[]) =>
    new UpdateManyBudgets(container.cradle.budgetRepository).execute(0, budgets);
