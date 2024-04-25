import { Request, Response } from "express";
import { CreateCategory } from "../../domain/use-cases/category/create-category";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { CustomResponse } from "../../utils/response/custom.response";
import { GetOneCategory } from "../../domain/use-cases/category/get-one-category";
import { GetAllCategories } from "../../domain/use-cases";

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
}