import { container } from "../../../infraestructure/dependencies/container";
import { EmailService } from "../../../utils/emails/email.service";
import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateTransactionDto } from "../../dtos/transaction/create-transaction.dto";
import { TransactionEntity, WalletEntity } from "../../entities";
import { BudgetRepository } from "../../repositories/budget.repository";
import { TransactionRepository } from "../../repositories/transaction.repository";
import { WalletRepository } from "../../repositories/wallet.repository";
import { CreateNotification } from "../notification/create-notification";
import { GetUser } from "../users/get-user";

export interface CreateTransactionUseCase {
    execute(dto: CreateTransactionDto[] | CreateTransactionDto): Promise<string | CustomResponse>;
}

export class CreateTransaction implements CreateTransactionUseCase {

    constructor(
        private repository: TransactionRepository,
        private wallet: WalletRepository,
        private budget: BudgetRepository,
        private emailService: EmailService,
    ) { }
    async execute(dto: CreateTransactionDto[] | CreateTransactionDto): Promise<string | CustomResponse> {
        const transaction = await this.repository.create(dto)

        // Asegurarse de que dto sea siempre un array
        dto = Array.isArray(dto) ? dto : [dto];

        for (const item of dto) {
            let walletData = await this.wallet.findById(item.walletId, item.userId)

            if (walletData instanceof WalletEntity) {

                if (item.type === "OUTFLOW") {
                    const budget = await this.budget.get_one_by_date(
                        item.walletId, [item.categoryId], item.userId, item.date
                    )

                    if (budget instanceof Array) {
                        for (const bud of budget) {
                            // agregamos la transacción a uno ovarios budgets
                            if (transaction instanceof TransactionEntity) {
                                await this.repository.createTransactionBudget(bud.id, transaction.id)
                            }
                        }
                    }
                }
            }
        }
        return "transaction created successfully"
    }

    async save_notification(user: string) {
        const notification = new CreateNotification(container.cradle.notificationRepository)

        await notification.execute({
            title: "Exceeded its budget",
            message: "Your budget for this month has been exceeded",
            userId: user,
            read: false,
        })
    }

    async send_email(user_id: string, budget_name: string, budget_amount: number, current_spending: number) {
        try {
            const user = new GetUser(container.cradle.userRepository)
            const userData = await user.execute(user_id)

            if (userData instanceof CustomResponse || userData === undefined) {
                return new CustomResponse("user not found", 400)
            }
            else {
                await this.emailService.budgetExceeded(
                    userData.email!,
                    userData.name.toUpperCase(),
                    budget_name.toUpperCase(),
                    budget_amount,
                    current_spending
                )
            }
        } catch (error) {
            console.error("Error sending email:", error)
        }
    }
}