import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateBudgetDto } from "../../dtos/budget/create-budget.dto";
import { WalletEntity } from "../../entities";
import { BudgetRepository } from "../../repositories/budget.repository";
import { WalletRepository } from "../../repositories/wallet.repository";

export interface CreateManyBudgetUseCase {
    execute(dto: CreateBudgetDto[] | CreateBudgetDto): Promise<string | CustomResponse>;
}


export class CreateManyBudget implements CreateManyBudgetUseCase {

    constructor(
        private repository: BudgetRepository,
        private wallet: WalletRepository,

    ) { }

    async execute(dto: CreateBudgetDto[] | CreateBudgetDto): Promise<string | CustomResponse> {
        const budget = await this.repository.createMany(dto);

        dto = Array.isArray(dto) ? dto : [dto];

        for (const item of dto) {
            let walletData = await this.wallet.findById(item.walletId, item.userId)

            if (walletData instanceof WalletEntity) {
                // walletData.balance = item.type === "INCOME"
                //     ? Number(walletData.balance) + Number(item.amount)
                //     : Number(walletData.balance) - Number(item.amount);

                // await this.wallet.update(item.walletId, { balance: walletData.balance }, item.userId)

                // if (item.type === "OUTFLOW") {
                //     const budget = await this.budget.get_one_by_date(item.walletId, item.categoryId, item.userId)
                //     if (budget instanceof Array) {
                //         for (const bud of budget) {
                //             bud.current_amount = Number(bud.current_amount) + Number(item.amount);
                //             await this.budget.update(+bud.id, bud, bud.userId)
                //             if (bud.current_amount > bud.limit_amount) {
                //                 this.save_notification(item.userId)
                //                 this.send_email(item.userId, bud.name, bud.limit_amount, bud.current_amount)
                //             }
                //         }
                //     }
                // }
            }
        }

        return budget
    }


}