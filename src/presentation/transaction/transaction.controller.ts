import { Request, Response } from "express";
import { CreateTransaction } from "../../domain/use-cases/transaction/create-transaction";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { CustomResponse } from "../../utils/response/custom.response";
import { DeleteTransaction } from "../../domain/use-cases/transaction/delete-transaction";
import { GetAllTransaction } from "../../domain/use-cases/transaction/get-all-transaction";
import { UpdateTransaction } from "../../domain/use-cases/transaction/update-transaction";
import { GetOneTransaction } from "../../domain/use-cases/transaction/get-one-transaction";
import { container } from "../../infraestructure/dependencies/container";
import { GetYears } from "../../domain/use-cases/transaction/get-years-transaction";

export class TransactionController {

    constructor(
        private readonly repository: TransactionRepository,
    ) { }

    // public getAll = (req: Request, res: Response) => {
    //     const today = new Date();
    //     const { userId } = req.body
    //     const {
    //         search,
    //         page = 1,
    //         per_page = 10,
    //         year = today.getFullYear(),
    //         month = today.getMonth() + 1,
    //         walletId = 0,
    //         order = 'date',
    //         asc = 'false'
    //     } = req.query;

    //     console.log(req.query);

    //     // Comprobar si search es una cadena de texto o undefined
    //     if (search && typeof search !== 'string') {
    //         return res.status(400).json({ error: 'Invalid search parameter.' });
    //     }

    //     return new GetAllTransaction(this.repository)
    //         .execute(userId, search, +page, +per_page, +year, +month, +walletId, order.toString(), asc.toString())
    //         .then(transactions => CustomResponse.handleResponse(res, transactions, 200))
    //         .catch(err => CustomResponse.handleResponse(res, err))
    // }

    public getAll = (req: Request, res: Response) => {
        // * ESTE ES UN EJEMPLO
        // localhost:3000/api/v1/transaction?page=1&per_page=5&categoryIds=[1,6]&walletIds=[1]&repeats=["EVERY%20DAY"]
        const { userId } = req.body
        const {
            search,
            page = 1,
            per_page = 10,
            categoryIds,
            walletIds,
            repeats,
            types,
            years,
            months
        } = req.query;

        // Comprobar si search es una cadena de texto o undefined
        if (search && typeof search !== 'string') {
            return res.status(400).json({ error: 'Invalid search parameter.' });
        }

        return new GetAllTransaction(this.repository)
            .execute(userId, search, +page, +per_page, {
                categoryIds: categoryIds ? JSON.parse(categoryIds as string) : null,
                walletIds: walletIds ? JSON.parse(walletIds as string) : null,
                repeats: repeats ? JSON.parse(repeats as string) : null,
                types: types ? JSON.parse(types as string) : null,
                year: years ? JSON.parse(years as string) : null,
                months: months ? JSON.parse(months as string) : null,
            })
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
        return new UpdateTransaction(this.repository, container.cradle.walletRepository, container.cradle.budgetRepository)
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

    public getYears = (req: Request, res: Response) => {
        const { userId } = req.body
        return new GetYears(this.repository)
            .execute(userId)
            .then(years => CustomResponse.handleResponse(res, years, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }
}