import { CustomResponse } from "../../../utils/response/custom.response";
import { UpdateCategoryDto } from "../../dtos";
import { CategoryRepository } from "../../repositories/category.repository";

export interface UpdateCategoryUseCase {
    execute(id: number, dto: UpdateCategoryDto, user_id: string): Promise<string | CustomResponse>;
}

export class UpdateCategory implements UpdateCategoryUseCase {

    constructor(
        private repository: CategoryRepository
    ) { }
    async execute(id: number, dto: UpdateCategoryDto, user_id: string): Promise<string | CustomResponse> {
        const response = await this.repository.update(id, dto, user_id)
        if (response instanceof CustomResponse) {
            return response;
        }
        return "Category update successfully"
    }

}