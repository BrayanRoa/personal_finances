import { Request, Response } from "express";
import { CustomResponse } from "../../utils/response/custom.response";
import { BudgetRepository } from "../../domain/repositories/budget.repository";
import { GetAllBudgets } from "../../domain/use-cases/budget/get-all-budget";
import { CreateBudget } from "../../domain/use-cases/budget/create-budget";
import { UpdateBudget } from "../../domain/use-cases/budget/update-budget";
import { DeleteBudget } from "../../domain/use-cases/budget/delete-budget";
import { TransactionByBudget } from "../../domain/use-cases/budget/transaction-by-budget";
import { GetOneBudget } from "../../domain/use-cases/budget/get-one-budget";
import { container } from "../../infraestructure/dependencies/container";

export class BudgetController {

    constructor(
        private readonly repository: BudgetRepository
    ) { }

    public Create = (req: Request, res: Response) => {
        return new CreateBudget(this.repository, container.cradle.transactionRepository)
            .execute(req.body)
            .then(budget => CustomResponse.handleResponse(res, budget, 201))
            .catch()
    }

    public getAll = (req: Request, res: Response) => {
        const { userId } = req.body
        return new GetAllBudgets(this.repository)
            .execute(userId)
            .then(budget => CustomResponse.handleResponse(res, budget, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }


    public getOne = (req: Request, res: Response) => {
        const { id } = req.params
        const { userId } = req.body
        return new GetOneBudget(this.repository)
            .execute(+id, userId)
            .then(budget => CustomResponse.handleResponse(res, budget, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public delete = (req: Request, res: Response) => {
        const { id } = req.params
        const { userId } = req.body
        return new DeleteBudget(this.repository)
            .execute(+id, userId)
            .then(del => CustomResponse.handleResponse(res, del, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public update = (req: Request, res: Response) => {
        const { id } = req.params
        return new UpdateBudget(this.repository)
            .execute(+id, req.body)
            .then(budget => CustomResponse.handleResponse(res, budget, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public transactionsByBudget = (req: Request, res: Response) => {
        const { userId } = req.body
        const { categories, start, end } = req.query

        let numArray
        // Asegurarte de que es un string antes de usar `split`
        if (typeof categories === 'string') {
            numArray = categories.split(',').map(Number); // Convierte el string en un array de números
            return new TransactionByBudget(this.repository)
                .execute(1, 5, userId, numArray!, start?.toString()!, end?.toString()!)
                .then(transactions => CustomResponse.handleResponse(res, transactions, 200))
                .catch(err => CustomResponse.handleResponse(res, err))
        } else {
            res.status(400).json({ error: 'categoryIds debe ser un string separado por comas' });
        }
    }
}