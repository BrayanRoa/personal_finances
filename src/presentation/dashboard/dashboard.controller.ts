import { Request, Response } from "express";
import { DasbboardRepository } from "../../domain/repositories/dashboard.repository";
import { SummaryWallet } from "../../domain/use-cases/dashboard/summary-wallets-dashboard";
import { CustomResponse } from "../../utils/response/custom.response";
import { SummaryTransactionsMonth } from "../../domain/use-cases/dashboard/summary-transactions-months";
import { CountCategoryTransaction } from "../../domain/use-cases/dashboard/count-category-transaction-dashboard";
import { SummaryBudgetInformation } from "../../domain/use-cases/dashboard/summary-budget-information-dashboard";

export class DashboardController {
    constructor(
        private readonly dashboardRepository: DasbboardRepository
    ) { }

    public summaryWallets = (req: Request, res: Response) => {
        const { userId } = req.body
        return new SummaryWallet(this.dashboardRepository)
            .execute(userId)
            .then(category => CustomResponse.handleResponse(res, category, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public transactionMonths = (req: Request, res: Response) => {
        console.log("object");
        const { userId } = req.body
        const { year } = req.params
        return new SummaryTransactionsMonth(this.dashboardRepository)
            .execute(userId, +year)
            .then(category => CustomResponse.handleResponse(res, category, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public countCategoryTransactions = (req: Request, res: Response) => {
        const { userId } = req.body
        return new CountCategoryTransaction(this.dashboardRepository)
            .execute(userId)
            .then(category => CustomResponse.handleResponse(res, category, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public budgetInformation = (req: Request, res: Response) => {
        const { userId } = req.body
        return new SummaryBudgetInformation(this.dashboardRepository)
            .execute(userId)
            .then(budget => CustomResponse.handleResponse(res, budget, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }
}