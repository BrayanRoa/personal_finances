import { container } from '../infraestructure/dependencies/container';
import { GetAllTransactionRecurring } from '../domain/use-cases/transaction/get-all-transaction-recurring';
import { CreateTransaction, UpdateTransaction } from '../domain/use-cases';
import { CreateTransactionDto, UpdateTransactionDto } from '../domain/dtos';
import moment from 'moment';
import { GetAllBudgetsRecurring } from '../domain/use-cases/budget/get-all-budgets-recurring';
import { UpdateBudgetDto } from '../domain/dtos/budget/update-budget.dto';
import { CreateBudgetDto } from '../domain/dtos/budget/create-budget.dto';
import { CreateManyBudget } from '../domain/use-cases/budget/create-many-budgets';
import { UpdateBudget } from '../domain/use-cases/budget/update-budget';
interface BaseInterface {
    id?: number | string;
    userId: string;
    description: string;
    name: string;
    date: Date;
    repeat: string;
    // active: boolean;
    walletId: number;
    next_date: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

interface Transaction extends BaseInterface {
    // id?: number;
    amount: number;
    // date: Date,
    // description: string;
    type: string;
    // repeat: string;
    // userId: string;
    // walletId: number;
    categoryId: number;
    active: boolean;
    // next_date: Date;
    // created_at?: Date;
    // updated_at?: Date;
    // deleted_at?: Date;
}

interface BudgetData extends BaseInterface {
    name: string;
    limit_amount: number;
    current_amount: number;
    percentage: number;
    categories: string;
    end_date: Date;
    active: boolean;
}

export function calculateNextDateToTransaction(transaction: Transaction) {
    const { id, created_at, updated_at, deleted_at, ...data } = transaction;
    if (data.next_date !== undefined) {
        data.date = new Date(data.next_date.getTime())
    }

    data.next_date = switchTransaction(data.date, data.repeat)!
    return {
        ...data,
        // Convertir el objeto Moment a una fecha de JavaScript
    };
}

export function calculateNextDateToBudget(budget: BudgetData) {
    const { id, created_at, updated_at, deleted_at, ...data } = budget;
    if (data.next_date !== undefined) {
        data.date = new Date(data.next_date.getTime())
    }

    data.next_date = switchTransaction(data.date, data.repeat)!
    return {
        ...data,
        // Convertir el objeto Moment a una fecha de JavaScript
    };
}

export function switchTransaction(date: Date, repeat: string) {
    let nextDate;
    switch (repeat) {
        case "EVERY DAY":
            nextDate = moment(date).add(1, 'days');
            break;
        case "EVERY TWO DAYS":
            nextDate = moment(date).add(2, 'days');
            break;
        case "EVERY WORKING DAY":
            const currentDay = moment(date).isoWeekday(); // 0 es lunes 6 es domingo
            // Si es viernes o fin de semana, se salta al próximo lunes.
            if (currentDay >= 4) {
                // 7 es el próximo lunes
                nextDate = moment(date).isoWeekday(7);
            } else {
                // Para los otros días, solo agrega 1.
                nextDate = moment(date).add(1, 'days');
            }
            break;
        case "EVERY WEEK":
            nextDate = moment(date).add(1, 'weeks');
            break;
        case "EVERY TWO WEEKS":
            nextDate = moment(date).add(2, 'weeks');
            break;
        case "EVERY MONTH":
            nextDate = moment(date).add(1, 'months');
            break;
        case "EVERY TWO MONTHS":
            nextDate = moment(date).add(2, 'months');
            break;
        case "EVERY THREE MONTHS":
            nextDate = moment(date).add(3, 'months');
            break;
        case "EVERY SIX MONTHS":
            nextDate = moment(date).add(6, 'months');
            break;
        case "EVERY YEAR":
            nextDate = moment(date).add(1, 'years');
            break;
        case "NEVER":
            nextDate = null;
            break;
        default:
            throw new Error(`Invalid repeat value: ${repeat}`);
    }

    return nextDate?.toDate()
}

export const transactionsRecurring = () => {
    return new GetAllTransactionRecurring(container.cradle.transactionRepository)
        .execute()
        .then((transactions) => {
            console.log(transactions);
            if (transactions instanceof Array) {
                const modifiedTransactions = transactions.map(calculateNextDateToTransaction);
                if (modifiedTransactions) {
                    saveTransactions(modifiedTransactions)
                    transactions.forEach(transaction => {
                        transaction.active = false
                    })
                    updateTransactions(transactions)
                }
                // TODO: AQUI PODRIA ALMACENAR EN UN LOG QUE TODAS LAS TRANSACCIONES DEL DÍA SE HICIERON BIEN O MAL
                return transactions; // ¿Debería ser 'return modifiedTransactions'?
            }
            return;
        }
        ).catch(
            (error) => {
                console.error("An error occurred: ", error);
                return error;
            }
        )
}

export const budgetsRecurring = () => {
    return new GetAllBudgetsRecurring(container.cradle.budgetRepository)
        .execute()
        .then((budgets) => {
            // console.log({budgets});
            if (budgets instanceof Array) {
                const modifiedBudgets = budgets.map(calculateNextDateToBudget);
                if (modifiedBudgets) {
                    saveBudget(modifiedBudgets)
                    budgets.forEach(budget => {
                        budget.active = false
                    })
                    updateBudgets(budgets)
                }
                // TODO: AQUI PODRIA ALMACENAR EN UN LOG QUE TODAS LAS TRANSACCIONES DEL DÍA SE HICIERON BIEN O MAL
                return budgets; // ¿Debería ser 'return modifiedTransactions'?
            }
            return;
        }
        ).catch(
            (error) => {
                console.error("An error occurred: ", error);
                return error;
            }
        )
}

const saveTransactions = (transactions: CreateTransactionDto[]) => {
    return new CreateTransaction(
        container.cradle.transactionRepository,
        container.cradle.walletRepository,
        container.cradle.budgetRepository,
        container.cradle.emailService,
    ).execute(transactions).then()
}

const saveBudget = (budgets: CreateBudgetDto[]) => {
    return new CreateManyBudget(container.cradle.budgetRepository, container.cradle.walletRepository).execute(budgets).then()
}

const updateTransactions = (transactions: UpdateTransactionDto[]) => {
    return new UpdateTransaction(container.cradle.transactionRepository, container.cradle.walletRepository).execute(0, transactions).then()
}

const updateBudgets = (budgets: UpdateBudgetDto[]) => {
    return new UpdateBudget(container.cradle.budgetRepository).execute(0, budgets).then()
}
// console.log(transactions);