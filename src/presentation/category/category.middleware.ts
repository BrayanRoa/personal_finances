import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { UpdateCategoryDto } from "../../domain/dtos/category/update-category.dto";
import { SharedMiddleware } from "../../utils/middleware/base.middleware";

export class CategoryMiddleware extends SharedMiddleware<CreateCategoryDto, UpdateCategoryDto> {
    constructor() {
        super(CreateCategoryDto, UpdateCategoryDto)
    }
}