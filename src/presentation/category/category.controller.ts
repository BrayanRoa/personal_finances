import { Request, Response } from "express";
import { CreateCategory } from "../../domain/use-cases/category/create-category";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { CustomResponse } from "../../utils/response/custom.response";
import { GetOneCategory } from "../../domain/use-cases/category/get-one-category";
import { GetAllCategories } from "../../domain/use-cases";
import { DeleteCategory } from "../../domain/use-cases/category/delete-category";
import { container } from "../../infraestructure/dependencies/container";
import { CountTransactionByCategory } from "../../domain/use-cases/category/count-transaction-by-category";

export class CategoryController {

    constructor(
        private readonly categoryRepository: CategoryRepository
    ) { }

    public Create = (req: Request, res: Response) => {
        return new CreateCategory(this.categoryRepository)
            .execute(req.body)
            .then(category => CustomResponse.handleResponse(res, category, 201))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public getAll = (req: Request, res: Response) => {
        return new GetAllCategories(this.categoryRepository)
            .execute(req.body.userId)
            .then(categories => CustomResponse.handleResponse(res, categories, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public getOne = (req: Request, res: Response) => {
        const { id } = req.params
        const { userId } = req.body
        return new GetOneCategory(this.categoryRepository)
            .execute(+id, userId)
            .then(categories => CustomResponse.handleResponse(res, categories, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public delete = (req: Request, res: Response) => {
        const { id } = req.params
        const { userId } = req.body
        return new DeleteCategory(this.categoryRepository, container.cradle.transactionRepository)
            .execute(+id, userId)
            .then(category => CustomResponse.handleResponse(res, category, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public transactionByCategory = (req: Request, res: Response) => {
        const { walletId } = req.params
        const { userId } = req.body
        console.log(userId);
        return new CountTransactionByCategory(this.categoryRepository)
            .execute(userId, +walletId)
            .then(transactions => CustomResponse.handleResponse(res, transactions, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }
}