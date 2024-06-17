import { container } from '../infraestructure/dependencies/container';
import { GetAllTransactionRecurring } from '../domain/use-cases/transaction/get-all-transaction-recurring';
import { CreateTransaction, UpdateTransaction } from '../domain/use-cases';
import { CreateTransactionDto, UpdateTransactionDto } from '../domain/dtos';
import moment from 'moment';

interface Transaction {
    id?: number;
    amount: number;
    date:Date,
    description: string;
    type: string;
    repeat: string;
    userId: string;
    walletId: number;
    categoryId: number;
    active: boolean;
    next_date: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export function calculateNextDate(transaction: Transaction) {
    const { id, created_at, updated_at, deleted_at, ...data } = transaction;
    if (data.next_date !== undefined) {
        data.date = new Date(data.next_date.getTime())
    }
    let nextDate;
    switch (data.repeat) {
        case "EVERY DAY":
            nextDate = moment(data.date).add(1, 'days');
            break;
        case "EVERY TWO DAYS":
            nextDate = moment(data.date).add(2, 'days');
            break;
        case "EVERY WEEK":
            nextDate = moment(data.date).add(1, 'weeks');
            break;
        case "EVERY TWO WEEKS":
            nextDate = moment(data.date).add(2, 'weeks');
            break;
        case "EVERY MONTH":
            nextDate = moment(data.date).add(1, 'months');
            break;
        case "EVERY TWO MONTHS":
            nextDate = moment(data.date).add(2, 'months');
            break;
        case "EVERY THREE MONTHS":
            nextDate = moment(data.date).add(3, 'months');
            break;
        case "EVERY SIX MONTHS":
            nextDate = moment(data.date).add(6, 'months');
            break;
        case "EVERY YEAR":
            nextDate = moment(data.date).add(1, 'years');
            break;
        case "NEVER":
            nextDate = null;
            break;
        default:
            throw new Error(`Invalid repeat value: ${data.repeat}`);
    }

    return {
        ...data,
        next_date: nextDate!.toDate()  // Convertir el objeto Moment a una fecha de JavaScript
    };
}

export const transactionsRecurring = () => {
    return new GetAllTransactionRecurring(container.cradle.transactionRepository)
        .execute()
        .then((transactions) => {
            if (transactions instanceof Array) {
                const modifiedTransactions = transactions.map(calculateNextDate);
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

const saveTransactions = (transactions: CreateTransactionDto[]) => {
    return new CreateTransaction(container.cradle.transactionRepository).execute(transactions).then()
}

const updateTransactions = (transactions: UpdateTransactionDto[]) => {
    return new UpdateTransaction(container.cradle.transactionRepository).execute(0, transactions).then()
}
// console.log(transactions);