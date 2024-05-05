import { container } from '../infraestructure/dependencies/container';
import { GetAllTransactionRecurring } from '../domain/use-cases/transaction/get-all-transaction-recurring';
import { CreateTransaction, UpdateTransaction } from '../domain/use-cases';
import { CreateTransactionDto, UpdateTransactionDto } from '../domain/dtos';


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
    const today = new Date();
    const { id, created_at, updated_at, deleted_at, ...rest } = transaction;
    rest.date = new Date();
    rest.active = true; // * MUST ALWAYS BE TRUE BECAUSE ITS A CONDITION FOR FINDING ALL RECURRING TRANSACTIONS
    switch (rest.repeat) {
        case "EVERY DAY":
            rest.next_date = new Date(today.setDate(today.getDate() + 1))
            break
        case "EVERY TWO DAYS":
            rest.next_date = new Date(today.setDate(today.getDate() + 2))
            break
        case "EVERY WORKING DAY":
            rest.next_date = new Date(today.setDate(today.getDate() + 1))
            if (today.getDay() === 6) {
                rest.next_date = new Date(today.setDate(today.getDate() + 2))
            }
            if (today.getDay() === 0) {
                rest.next_date = new Date(today.setDate(today.getDate() + 1))
            }
        case "EVERY WEEK":
            rest.next_date = new Date(today.setDate(today.getDate() + 7))
            break
        case "EVERY TWO WEEKS":
            rest.next_date = new Date(today.setDate(today.getDate() + 14))
            break
        case "EVERY MONTH":
            rest.next_date = new Date(today.setDate(today.getDate() + 30))
            break
        case "EVERY TWO MONTHS":
            rest.next_date = new Date(today.setMonth(today.getMonth() + 2))
            break
        case "EVERY THREE MONTHS":
            rest.next_date = new Date(today.setMonth(today.getMonth() + 3))
            break
        case "EVERY SIX MONTHS":
            rest.next_date = new Date(today.setMonth(today.getMonth() + 6))
            break
        case "EVERY YEAR":
            rest.next_date = new Date(today.setMonth(today.getMonth() + 12))
            break
        case "NEVER":
            break
    }
    return rest;
}

export const transactionsRecurring = () => {
    return new GetAllTransactionRecurring(container.cradle.transactionRepository).execute().then(
        (transactions) => {
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