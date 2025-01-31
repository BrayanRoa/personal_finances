import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateCategoryDto } from "../../dtos/category/create-category.dto";
import { CategoryEntity } from "../../entities/category/category.entity";
import { CategoryRepository } from "../../repositories/category.repository";

export interface CreateCategoryUseCase {
    execute(dto: CreateCategoryDto): Promise<CategoryEntity | string | CustomResponse>;
}

export class CreateCategory implements CreateCategoryUseCase {

    constructor(
        public repository: CategoryRepository
    ) { }
    async execute(dto: CreateCategoryDto): Promise<CategoryEntity | string | CustomResponse> {
        return this.repository.create(dto)
    }
}