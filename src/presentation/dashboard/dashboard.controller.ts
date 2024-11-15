import { Request, Response } from "express";
import { DasbboardRepository } from "../../domain/repositories/dashboard.repository";
import { SummaryWallet } from "../../domain/use-cases/dashboard/summary-wallets-dashboard";
import { CustomResponse } from "../../utils/response/custom.response";

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
}