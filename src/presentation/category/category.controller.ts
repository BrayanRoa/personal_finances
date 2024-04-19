import { Request, Response } from "express";
import { CreateCategory } from "../../domain/use-cases/category/create-category";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { CustomResponse } from "../../utils/response/custom.response";
import { GetAllCategories } from "../../domain/use-cases/category/get-all";

export class CategoryController {

    constructor(
        private readonly repository: CategoryRepository
    ) { }

    public Create = (req: Request, res: Response) => {
        return new CreateCategory(this.repository)
            .execute(req.body)
            .then(category => CustomResponse.handleResponse(res, category, 201))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public getAll = (req: Request, res: Response) => {
        return new GetAllCategories(this.repository)
            .execute(req.body.userId)
            .then(categories => CustomResponse.handleResponse(res, categories, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }
}