import { CategoryDatasource } from "../../domain/datasources/category.datasource";
import { UpdateCategoryDto } from "../../domain/dtos";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryEntity } from "../../domain/entities/category/category.entity";
import { ColorEntity } from "../../domain/entities/category/color.entity";
import { IconEntity } from "../../domain/entities/category/icon.entity";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { CustomResponse } from "../../utils/response/custom.response";

export class CategoryRepositoryImp implements CategoryRepository {

    constructor(
        private readonly categoryDatasource: CategoryDatasource
    ) { }
    update(id: number, dto: UpdateCategoryDto, user_id: string): Promise<CustomResponse | CategoryEntity> {
        return this.categoryDatasource.update(id, dto, user_id)
    }
    getColors(): Promise<CustomResponse | ColorEntity[]> {
        return this.categoryDatasource.getColors()
    }
    getIcons(): Promise<CustomResponse | IconEntity[]> {
        return this.categoryDatasource.getIcons()
    }
    // transactionWithCategoriesAndAmount(userId: string, walletId: number): Promise<CustomResponse | TransactionByCategory[]> {
    //     return this.categoryDatasource.transactionWithCategoriesAndAmount(userId, walletId)
    // }
    delete(id: number, userId: string): Promise<string | CustomResponse> {
        return this.categoryDatasource.delete(id, userId)
    }
    defaultCategories(userId: string): Promise<string | CustomResponse> {
        return this.categoryDatasource.defaultCategories(userId)
    }
    getOne(id: number, userId: string): Promise<CategoryEntity | CustomResponse> {
        return this.categoryDatasource.getOne(id, userId);
    }
    getAll(userId: string): Promise<CustomResponse | CategoryEntity[]> {
        return this.categoryDatasource.getAll(userId)
    }
    create(data: CreateCategoryDto): Promise<string | CustomResponse> {
        data.name = data.name.toUpperCase()
        return this.categoryDatasource.create(data)
    }

}