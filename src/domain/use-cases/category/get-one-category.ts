import { CustomResponse } from "../../../utils/response/custom.response";
import { CategoryEntity } from "../../entities/category/category.entity";
import { CategoryRepository } from "../../repositories/category.repository";

export interface GetOneCategoryUseCase {
    execute(categoryId: number, userId: string): Promise<CategoryEntity | CustomResponse>;
}

export class GetOneCategory implements GetOneCategoryUseCase {
    constructor(
        private readonly repository: CategoryRepository,
    ) { }

    execute(categoryId: number, userId: string): Promise<CategoryEntity | CustomResponse> {
        return this.repository.getOne(categoryId, userId)
    }

}