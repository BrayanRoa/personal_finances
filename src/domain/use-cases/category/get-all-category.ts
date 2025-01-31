import { CustomResponse } from "../../../utils/response/custom.response";
import { CategoryEntity } from "../../entities/category/category.entity";
import { CategoryRepository } from "../../repositories/category.repository";

export interface GetAllCategoriesUseCase {
    execute(userId: string): Promise<CategoryEntity[] | CustomResponse>;
}


export class GetAllCategories implements GetAllCategoriesUseCase {

    constructor(
        private readonly repository: CategoryRepository
    ) { }
    async execute(userId: string): Promise<CustomResponse | CategoryEntity[]> {
        return this.repository.getAll(userId)
    }

}