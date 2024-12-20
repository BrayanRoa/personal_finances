import { CategoryDatasource } from "../../domain/datasources/category.datasource";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryEntity } from "../../domain/entities/category/category.entity";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { TransactionByCategory } from "../../utils/interfaces/count_transaction_by_category.interface";
import { CustomResponse } from "../../utils/response/custom.response";

export class CategoryRepositoryImp implements CategoryRepository {

    constructor(
        private readonly categoryDatasource: CategoryDatasource
    ) { }
    transactionWithCategoriesAndAmount(userId: string, walletId: number): Promise<CustomResponse | TransactionByCategory[]> {
        return this.categoryDatasource.transactionWithCategoriesAndAmount(userId, walletId)
    }
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
    create(data: CreateCategoryDto, user_audits: string): Promise<string | CustomResponse> {
        data.name = data.name.toUpperCase()
        return this.categoryDatasource.create(data, user_audits)
    }

}