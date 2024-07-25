import { Request, Response } from "express";
import { CustomResponse } from "../../utils/response/custom.response";
import { BudgetRepository } from "../../domain/repositories/budget.repository";
import { GetAllBudgets } from "../../domain/use-cases/budget/get-all-budget";
import { CreateBudget } from "../../domain/use-cases/budget/create-budget";
import { UpdateBudget } from "../../domain/use-cases/budget/update-budget";
import { DeleteBudget } from "../../domain/use-cases/budget/delete-budget";

export class BudgetController {

    constructor(
        private readonly repository: BudgetRepository
    ) { }

    public Create = (req: Request, res: Response) => {
        return new CreateBudget(this.repository)
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
}