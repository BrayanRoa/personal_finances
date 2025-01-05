// import { container } from '../infraestructure/dependencies/container';
// import { GetAllTransactionRecurring } from '../domain/use-cases/transaction/get-all-transaction-recurring';
// import { CreateTransaction, UpdateTransaction } from '../domain/use-cases';
// import { CreateTransactionDto, UpdateTransactionDto } from '../domain/dtos';
// import { GetAllBudgetsRecurring } from '../domain/use-cases/budget/get-all-budgets-recurring';
// import { UpdateBudgetDto } from '../domain/dtos/budget/update-budget.dto';
// import { CreateBudgetDto } from '../domain/dtos/budget/create-budget.dto';
// import { CreateManyBudget } from '../domain/use-cases/budget/create-many-budgets';
// import { UpdateBudget } from '../domain/use-cases/budget/update-budget';
// import { QueryBuilder } from '../utils/query-builder';
// import { BudgetsToBeDeactivated } from '../domain/use-cases/budget/budgets-to-be-deactivated';
// interface BaseInterface {
//     id?: number | string;
//     userId: string;
//     description: string;
//     name: string;
//     date: Date;
//     repeat: string;
//     walletId: number;
//     next_date: Date;
//     created_at?: Date;
//     updated_at?: Date;
//     deleted_at?: Date;
// }

// interface Transaction extends BaseInterface {
//     amount: number;
//     type: string;
//     categoryId: number;
//     active: boolean;
// }

// interface BudgetData extends BaseInterface {
//     name: string;
//     limit_amount: number;
//     current_amount: number;
//     percentage: number;
//     categories: string;
//     end_date: Date;
//     active: boolean;
// }

// export function calculateNextDateToTransaction(transaction: Transaction) {
//     const { id, created_at, updated_at, deleted_at, ...data } = transaction;
//     if (data.next_date !== undefined) {
//         data.date = new Date(data.next_date.getTime())
//     }

//     data.next_date = QueryBuilder.switchTransaction(data.date, data.repeat)!
//     return {
//         ...data,
//         // Convertir el objeto Moment a una fecha de JavaScript
//     };
// }

// export function calculateNextDateToBudget(budget: BudgetData) {
//     const { id, created_at, updated_at, deleted_at, ...data } = budget;
//     if (data.next_date !== undefined) {
//         data.date = new Date(data.next_date.getTime())
//     }

//     data.next_date = QueryBuilder.switchTransaction(data.date, data.repeat)!
//     return {
//         ...data,
//         // Convertir el objeto Moment a una fecha de JavaScript
//     };
// }

// export const transactionsRecurring = () => {
//     return new GetAllTransactionRecurring(container.cradle.transactionRepository)
//         .execute()
//         .then((transactions) => {
//             console.log(transactions);
//             if (transactions instanceof Array) {
//                 const modifiedTransactions = transactions.map(calculateNextDateToTransaction);
//                 if (modifiedTransactions) {
//                     saveTransactions(modifiedTransactions)
//                     transactions.forEach(transaction => {
//                         transaction.active = false
//                     })
//                     updateTransactions(transactions)
//                 }
//                 // TODO: AQUI PODRIA ALMACENAR EN UN LOG QUE TODAS LAS TRANSACCIONES DEL DÍA SE HICIERON BIEN O MAL
//                 return transactions; // ¿Debería ser 'return modifiedTransactions'?
//             }
//             return;
//         }
//         ).catch(
//             (error) => {
//                 console.error("An error occurred: ", error);
//                 return error;
//             }
//         )
// }

// export const budgetsRecurring = () => {
//     return new GetAllBudgetsRecurring(container.cradle.budgetRepository)
//         .execute()
//         .then((budgets) => {
//             // console.log({budgets});
//             if (budgets instanceof Array) {
//                 const modifiedBudgets = budgets.map(calculateNextDateToBudget);
//                 if (modifiedBudgets) {
//                     saveBudget(modifiedBudgets)
//                     budgets.forEach(budget => {
//                         budget.active = false
//                     })
//                     updateBudgets(budgets)
//                 }
//                 // TODO: AQUI PODRIA ALMACENAR EN UN LOG QUE TODAS LAS TRANSACCIONES DEL DÍA SE HICIERON BIEN O MAL
//                 return budgets; // ¿Debería ser 'return modifiedTransactions'?
//             }
//             return;
//         }
//         ).catch(
//             (error) => {
//                 console.error("An error occurred: ", error);
//                 return error;
//             }
//         )
// }

// // metodo para desactivar budgets que ya no cubren la fecha limite
// export const budgetsToBeDeactivated = () => {
//     return new BudgetsToBeDeactivated(container.cradle.budgetRepository).execute().then((budgets) => {
//         if (budgets instanceof Array) {
//             const data = budgets.map((budgets) => {
//                 return { ...budgets, active: false }
//             })
//             updateBudgets(data)
//         }
//     })
// }

// const saveTransactions = (transactions: CreateTransactionDto[]) => {
//     return new CreateTransaction(
//         container.cradle.transactionRepository,
//         container.cradle.walletRepository,
//         container.cradle.budgetRepository,
//         container.cradle.emailService,
//     ).execute(transactions).then()
// }

// const saveBudget = (budgets: CreateBudgetDto[]) => {
//     return new CreateManyBudget(container.cradle.budgetRepository, container.cradle.walletRepository).execute(budgets).then()
// }

// const updateTransactions = (transactions: UpdateTransactionDto[]) => {
//     return new UpdateTransaction(container.cradle.transactionRepository, container.cradle.walletRepository).execute(0, transactions).then()
// }

// const updateBudgets = (budgets: UpdateBudgetDto[]) => {
//     return new UpdateBudget(container.cradle.budgetRepository).execute(0, budgets).then()
// }


//TODO: OJO ESTO ES UN REFACTOR, DEBO REVISAR QUE FUNCIONE BIEN Y AHI SI ELIMINO LO DE ARRIBA PORQUE ESO SI FUNCIONA BIEN 


// Importaciones: Dependencias externas
import { container } from '../infraestructure/dependencies/container';

// Importaciones: Casos de Uso
import { GetAllTransactionRecurring } from '../domain/use-cases/transaction/get-all-transaction-recurring';
import { CreateTransaction, UpdateTransaction } from '../domain/use-cases';
import { GetAllBudgetsRecurring } from '../domain/use-cases/budget/get-all-budgets-recurring';
import { CreateManyBudget } from '../domain/use-cases/budget/create-many-budgets';
import { UpdateBudget } from '../domain/use-cases/budget/update-budget';
import { BudgetsToBeDeactivated } from '../domain/use-cases/budget/budgets-to-be-deactivated';

// Importaciones: DTOs
import { CreateTransactionDto, UpdateTransactionDto } from '../domain/dtos';
import { UpdateBudgetDto } from '../domain/dtos/budget/update-budget.dto';
import { CreateBudgetDto } from '../domain/dtos/budget/create-budget.dto';

// Importaciones: Utilidades
import { QueryBuilder } from '../utils/query-builder';

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

interface BudgetData extends BaseInterface {
    limit_amount: number;
    current_amount: number;
    percentage: number;
    categories: string;
    end_date: Date;
    active: boolean;
}

// Funciones: Cálculo de Fechas
export function calculateNextDateToTransaction(transaction: Transaction) {
    const { id, created_at, updated_at, deleted_at, ...data } = transaction;

    if (data.next_date) {
        data.date = new Date(data.next_date.getTime());
    }

    data.next_date = QueryBuilder.switchTransaction(data.date, data.repeat)!;

    return { ...data };
}

export function calculateNextDateToBudget(strat_date: Date, repeat: string) {
    // const { id, created_at, updated_at, deleted_at, ...data } = budget;

    // if (data.next_date) {
    //     data.date = new Date(data.next_date.getTime());
    // }

    const next_date = QueryBuilder.switchTransaction(strat_date, repeat)!;

    return next_date;
}

// Funciones: Operaciones con Transacciones
export const transactionsRecurring = async () => {
    try {
        const transactions = await new GetAllTransactionRecurring(container.cradle.transactionRepository).execute();

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
// export const budgetsRecurring = async () => {
//     try {
//         const budgets = await new GetAllBudgetsRecurring(container.cradle.budgetRepository).execute();

//         if (budgets instanceof Array) {
//             const modifiedBudgets = budgets.map(calculateNextDateToBudget);

//             if (modifiedBudgets) {
//                 saveBudget(modifiedBudgets);
//                 budgets.forEach(budget => (budget.active = false));
//                 updateBudgets(budgets);
//             }

//             // TODO: Log de éxito/fallo para presupuestos procesados
//             return budgets;
//         }
//     } catch (error) {
//         console.error('An error occurred:', error);
//         return error;
//     }
// };

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
    new UpdateTransaction(container.cradle.transactionRepository, container.cradle.walletRepository).execute(0, transactions);

const updateBudgets = (budgets: UpdateBudgetDto[]) =>
    new UpdateBudget(container.cradle.budgetRepository).execute(0, budgets);
