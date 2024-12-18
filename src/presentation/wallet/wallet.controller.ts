import { Request, Response } from "express";
import { WalletRepository } from "../../domain/repositories/wallet.repository";
import { CreateWallet } from "../../domain/use-cases/wallet/create-wallet";
import { CustomResponse } from "../../utils/response/custom.response";
import { GetAllWallet } from "../../domain/use-cases/wallet/get-all-wallet";
import { GetOneWallet } from "../../domain/use-cases/wallet/get-one-wallet";
import { UpdateWallet } from "../../domain/use-cases/wallet/update-wallet";
import { DeleteWallet } from "../../domain/use-cases/wallet/delete-wallet";
import { DashboardWallet } from "../../domain/use-cases/wallet/dashboard-wallet";
import { IncomesAndExpensesByWalletType } from "../../domain/use-cases/wallet/incomes-expenses-by-wallet.wallet";
import { container } from "../../infraestructure/dependencies/container";
import { MonthlyBalanceByWallet } from "../../domain/use-cases/wallet/monthly-balance-by-wallet.wallet";

export class WalletController {
    constructor(
        private readonly walletRepository: WalletRepository,
    ) { }


    public getAll = (req: Request, res: Response) => {
        const { userId } = req.body
        return new GetAllWallet(this.walletRepository)
            .execute(userId)
            .then(response => CustomResponse.handleResponse(res, response, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public getOne = (req: Request, res: Response) => {
        const { id } = req.params
        const { userId } = req.body
        return new GetOneWallet(this.walletRepository)
            .execute(+id, userId)
            .then(response => CustomResponse.handleResponse(res, response, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public create = (req: Request, res: Response) => {
        return new CreateWallet(this.walletRepository, container.cradle.transactionRepository)
            .execute(req.body)
            .then(response => CustomResponse.handleResponse(res, response, 201))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public update = async (req: Request, res: Response) => {
        const { id } = req.params
        return new UpdateWallet(this.walletRepository)
            .execute(+id, req.body)
            .then(response => CustomResponse.handleResponse(res, response, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public delete = async (req: Request, res: Response) => {
        const { id } = req.params
        const { userId } = req.body
        return new DeleteWallet(this.walletRepository)
            .execute(+id, userId)
            .then(response => CustomResponse.handleResponse(res, response, 204))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public dashboardWallet = async (req: Request, res: Response) => {
        const { id } = req.params
        const { user_audits } = req.body
        return new DashboardWallet(this.walletRepository)
            .execute(+id, user_audits)
            .then(response => CustomResponse.handleResponse(res, response, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public IncomesAndExpensesByWallet = (req: Request, res: Response) => {
        const { userId } = req.body
        return new IncomesAndExpensesByWalletType(this.walletRepository)
            .execute(userId)
            .then((response) => CustomResponse.handleResponse(res, response, 200))
            .catch((err) => CustomResponse.handleResponse(res, err))
    }

    public monthlyBalanceByWallet = (req: Request, res: Response) => {
        const { userId } = req.body
        const { year } = req.params
        return new MonthlyBalanceByWallet(this.walletRepository)
            .execute(userId, +year)
            .then((response) => CustomResponse.handleResponse(res, response, 200))
            .catch((err) => CustomResponse.handleResponse(res, err))
    }
}