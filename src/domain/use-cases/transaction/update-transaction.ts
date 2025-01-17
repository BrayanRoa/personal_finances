import { CustomResponse } from "../../../utils/response/custom.response";
import { UpdateTransactionDto } from "../../dtos/transaction/update-transaction.dto";
import { TransactionEntity } from "../../entities";
import { BudgetRepository } from "../../repositories/budget.repository";
import { TransactionRepository } from "../../repositories/transaction.repository";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface UpdateTransactionUseCase {
    execute(id: number, dto: UpdateTransactionDto[] | UpdateTransactionDto): Promise<string | CustomResponse>;
}


export class UpdateTransaction implements UpdateTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
        private walletRepositopry: WalletRepository,
        private budgetRepository: BudgetRepository
    ) {}

    async execute(id: number, dto: UpdateTransactionDto[] | UpdateTransactionDto): Promise<string | CustomResponse> {
        let transaction, budgets

        // obtengo la transacción antes de actualizarla para saber si cambio la categoria
        if (!(dto instanceof Array)) {
            transaction = await this.repository.findById(id, dto.userId)
        }

        const result = await this.repository.update(id, dto);
        if (result instanceof CustomResponse) {
            return result;
        }

        if (result instanceof Object && !(dto instanceof Array)) {
            const wallet = await this.walletRepositopry.findById(dto.walletId!, dto.userId);
            if (wallet instanceof CustomResponse) {
                return wallet;
            }

            // obtenemos los budgets para la fecha y categoría de la transacción
            // miramos si cambio la categoria
            if (!(transaction instanceof CustomResponse) && result.categoryId !== transaction?.categoryId) {
                budgets = await this.budgetRepository.get_one_by_date(
                    wallet.id, [transaction?.categoryId!], dto.userId, dto.date!
                )
                if (budgets instanceof Array) {
                    for (const bud of budgets) {
                        // agregamos la transacción a uno ovarios budgets
                        if (result instanceof TransactionEntity) {
                            await this.repository.markBudgetTransactionAsDeleted(bud.id, result.id)
                        }
                    }
                }
            }



            if (dto.type === "OUTFLOW") {
                budgets = await this.budgetRepository.get_one_by_date(
                    wallet.id, [dto?.categoryId!], dto.userId, dto.date!
                )

                if (budgets instanceof Array) {
                    for (const bud of budgets) {
                        // agregamos la transacción a uno ovarios budgets
                        if (result instanceof TransactionEntity) {
                            await this.repository.createTransactionBudget(bud.id, result.id)
                        }
                    }
                }
            }

            const { id, transactions, ...data } = wallet;
            await this.walletRepositopry.update(dto.walletId!, data, dto.userId);
        }

        return "transaction update successfully";
    }

    // TODO: OJO ESTO YA NO LO USO PERO LO DEJO AQUI POR SI EN UN FUTURO ME SIRVE
    // Define una tabla de decisiones para mapear combinaciones de acción y tipo de cambio a una función
    // ADD - mean that the user increments the amount of the transaction 
    // SUBTRACT - mean that the user decrements the amount of the transaction
    // INCOME - mean that the user adds money to their wallet
    // OUTFLOW - mean that the user subtracts money from their wallet
    // THE COMBINATION - mean that the user increments or decrement the amount of the transaction and change the type
    // const updateRules: Record<string, (wallet: any, dto: UpdateTransactionDto, result: any) => void> = {
    //     "ADD_": (wallet, _, result) => {
    //         wallet.balance += result.amountDifference;
    //         wallet.incomes += result.amountDifference;
    //     },
    //     "SUBTRACT_": (wallet, _, result) => {
    //         wallet.incomes -= result.amountDifference;
    //         wallet.balance = wallet.incomes - wallet.expenses;
    //     },
    //     "_INCOME": (wallet, dto) => {
    //         wallet.incomes += dto.amount!;
    //         wallet.expenses -= dto.amount!;
    //         wallet.balance = wallet.incomes - wallet.expenses;
    //     },
    //     "_OUTFLOW": (wallet, dto) => {
    //         wallet.expenses += dto.amount!;
    //         wallet.incomes -= dto.amount!;
    //         wallet.balance = wallet.incomes - wallet.expenses;
    //     },
    //     "SUBTRACT_OUTFLOW": (wallet, dto, result) => {
    //         wallet.expenses += dto.amount!;
    //         wallet.incomes -= dto.amount! + result.amountDifference;
    //         wallet.balance = wallet.incomes - wallet.expenses;
    //     },
    //     "SUBTRACT_INCOME": (wallet, dto, result) => {
    //         wallet.incomes += dto.amount!;
    //         wallet.expenses -= dto.amount! + result.amountDifference;
    //         wallet.balance = wallet.incomes - wallet.expenses;
    //     },
    //     "ADD_OUTFLOW": (wallet, dto, result) => {
    //         wallet.expenses += dto.amount!;
    //         wallet.incomes -= dto.amount! - result.amountDifference;
    //         wallet.balance = wallet.incomes - wallet.expenses;
    //     },
    //     "ADD_INCOME": (wallet, dto, result) => {
    //         wallet.incomes += dto.amount!;
    //         wallet.expenses -= dto.amount! - result.amountDifference;
    //         wallet.balance = wallet.incomes - wallet.expenses;
    //     },
    // };

    // Genera la clave para la tabla de decisión
    // const key = `${result.action || ""}_${result.typeChange || ""}`;
    // Ejecuta la función correspondiente si existe
    // const updateFn = updateRules[key];
    // if (updateFn) {
    //     updateFn(wallet, dto, result);
    // }



}