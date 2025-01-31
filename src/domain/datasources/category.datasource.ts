import { TransactionByCategory } from "../../utils/interfaces/count_transaction_by_category.interface";
import { CustomResponse } from "../../utils/response/custom.response";
import { UpdateCategoryDto } from "../dtos";
import { CreateCategoryDto } from "../dtos/category/create-category.dto";
import { CategoryEntity } from "../entities/category/category.entity";
import { ColorEntity } from "../entities/category/color.entity";
import { IconEntity } from "../entities/category/icon.entity";


export abstract class CategoryDatasource {

    abstract getAll(userId: string): Promise<CategoryEntity[] | CustomResponse>;
    abstract create(data: CreateCategoryDto): Promise<string | CustomResponse>;
    abstract getOne(id: number, userId: string): Promise<CategoryEntity | CustomResponse>
    abstract defaultCategories(userId: string): Promise<string | CustomResponse>

    abstract delete(id: number, userId: string): Promise<string | CustomResponse>
    // abstract transactionWithCategoriesAndAmount(userId: string, walletId: number): Promise<CustomResponse | TransactionByCategory[]>
    abstract getColors(): Promise<CustomResponse | ColorEntity[]>

    abstract getIcons(): Promise<CustomResponse | IconEntity[]>
    abstract update(id: number, dto: UpdateCategoryDto, user_id: string): Promise<CustomResponse | CategoryEntity>

}
