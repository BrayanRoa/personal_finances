import { Request, Response } from "express";
import { CreateCategory } from "../../domain/use-cases/category/create-category";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { CustomResponse } from "../../utils/response/custom.response";
import { GetOneCategory } from "../../domain/use-cases/category/get-one-category";
import { GetAllCategories } from "../../domain/use-cases";
import { DeleteCategory } from "../../domain/use-cases/category/delete-category";
import { container } from "../../infraestructure/dependencies/container";
import { GetAllIcons } from "../../domain/use-cases/category/get-all-icon";
import { GetAllColors } from "../../domain/use-cases/category/get-all-colors";
import { UpdateCategory } from "../../domain/use-cases/category/update-category";
// import { CountTransactionByCategory } from "../../domain/use-cases/category/count-transaction-by-category";

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

    public update = (req: Request, res: Response) => {
        const { id } = req.params
        const { userId, ...data } = req.body
        return new UpdateCategory(this.categoryRepository)
            .execute(+id, data, userId)
            .then(category => CustomResponse.handleResponse(res, category, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public getIcons = (req: Request, res: Response) => {
        return new GetAllIcons(this.categoryRepository)
            .execute()
            .then(icons => CustomResponse.handleResponse(res, icons, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }

    public getColors = (req: Request, res: Response) => {
        return new GetAllColors(this.categoryRepository)
            .execute()
            .then(icons => CustomResponse.handleResponse(res, icons, 200))
            .catch(err => CustomResponse.handleResponse(res, err))
    }
}