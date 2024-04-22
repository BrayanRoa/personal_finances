import { CategoryDatasource } from "../../domain/datasources/category.datasource";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryEntity } from "../../domain/entities/category/category.entity";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { CustomResponse } from "../../utils/response/custom.response";

export class CategoryRepositoryImp implements CategoryRepository {

    constructor(
        private readonly dataSource: CategoryDatasource
    ) { }
    getAll(userId: string): Promise<CustomResponse | CategoryEntity[]> {
        return this.dataSource.getAll(userId)
    }
    create(category: CreateCategoryDto, user_audits: string): Promise<string | CustomResponse> {
        return this.dataSource.create(category, user_audits)
    }

}