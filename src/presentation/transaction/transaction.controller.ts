import { Request, Response } from "express";
import { CreateTransaction } from "../../domain/use-cases/transaction/create-transaction";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { CustomResponse } from "../../utils/response/custom.response";
import { DeleteTransaction } from "../../domain/use-cases/transaction/delete-transaction";
import { GetAllTransaction } from "../../domain/use-cases/transaction/get-all-transaction";
import { UpdateTransaction } from "../../domain/use-cases/transaction/update-transaction";
import { GetOneTransaction } from "../../domain/use-cases/transaction/get-one-transaction";
import { container } from "../../infraestructure/dependencies/container";

export class TransactionController {

    constructor(
        private readonly repository: TransactionRepository,
    ) { }

    public getAll = (req: Request, res: Response) => {
        const today = new Date();
        const { userId } = req.body
        const { search, page=1, per_page=10, year=today.getFullYear(), month=today.getMonth()+1, walletId=0 } = req.query;

        // Comprobar si search es una cadena de texto o undefined
        if (search && typeof search !== 'string') {
            return res.status(400).json({ error: 'Invalid search parameter.' });
        }

        return new GetAllTransaction(this.repository)
            .execute(userId, search, +page, +per_page, +year, +month, +walletId)
            .then(transactions => CustomResponse.handleResponse(res, transactions, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public getOne = (req: Request, res: Response) => {
        const id = req.params.id
        const { userId } = req.body
        return new GetOneTransaction(this.repository)
            .execute(+id, userId)
            .then(transaction => CustomResponse.handleResponse(res, transaction, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public create = (req: Request, res: Response) => {
        return new CreateTransaction(
            this.repository,
            container.cradle.walletRepository,
            container.cradle.budgetRepository,
            container.cradle.emailService)
            .execute(req.body)
            .then(transaction => CustomResponse.handleResponse(res, transaction, 201))
            .catch(error => CustomResponse.handleResponse(res, error))
    }

    public update = (req: Request, res: Response) => {
        const { id } = req.params
        return new UpdateTransaction(this.repository, container.cradle.walletRepository)
            .execute(+id, req.body)
            .then(user => CustomResponse.handleResponse(res, user, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public delete = (req: Request, res: Response) => {
        const { id } = req.params
        return new DeleteTransaction(this.repository, container.cradle.walletRepository)
            .execute(+id, req.body.userId)
            .then(del => CustomResponse.handleResponse(res, del, 204))
            .catch(error => CustomResponse.handleResponse(res, error))
    }
}