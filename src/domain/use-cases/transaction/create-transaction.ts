import { container } from "../../../infraestructure/dependencies/container";
import { EmailService } from "../../../utils/emails/email.service";
import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateTransactionDto } from "../../dtos/transaction/create-transaction.dto";
import { WalletEntity } from "../../entities";
import { BudgetRepository } from "../../repositories/budget.repository";
import { TransactionRepository } from "../../repositories/transaction.repository";
import { WalletRepository } from "../../repositories/wallet.repository";
import { CreateNotification } from "../notification/create-notification";

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
                walletData.balance = item.type === "INCOME"
                    ? Number(walletData.balance) + Number(item.amount)
                    : Number(walletData.balance) - Number(item.amount);

                await this.wallet.update(item.walletId, { balance: walletData.balance }, item.userId)

                if (item.type === "OUTFLOW") {
                    const budget = await this.budget.get_one_by_date(item.walletId, item.categoryId, item.userId)
                    if (budget instanceof Array) {
                        for (const bud of budget) {
                            bud.current_amount = Number(bud.current_amount) + Number(item.amount);
                            await this.budget.update(+bud.id, bud, bud.userId)
                            if (bud.current_amount > bud.limit_amount) {
                                this.save_notification(item.userId)
                                this.send_email(bud.name, bud.limit_amount, bud.current_amount)
                            }
                        }
                    }
                }
            }
        }

        return transaction

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

    async send_email(budget_name: string, budget_amount: number, current_spending: number) {
        await this.emailService.budgetExceeded(
            "brayanandresrl@ufps.edu.co",
            "Brayan",
            budget_name.toUpperCase(),
            budget_amount,
            current_spending
        )
    }
}