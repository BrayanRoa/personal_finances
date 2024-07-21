import { CustomResponse } from "../../utils/response/custom.response";
import { CreateCategoryDto } from "../dtos/category/create-category.dto";
import { CategoryEntity } from "../entities/category/category.entity";


export abstract class CategoryDatasource {

    abstract getAll(userId: string): Promise<CategoryEntity[] | CustomResponse>;
    abstract create(data: CreateCategoryDto, user_audits: string): Promise<string | CustomResponse>;
    abstract getOne(id: number, userId: string): Promise<CategoryEntity | CustomResponse>
    abstract defaultCategories(userId: string): Promise<string | CustomResponse>

    abstract delete(id: number, userId: string): Promise<string | CustomResponse>
}