import { CategoryDatasource } from "../../domain/datasources/category.datasource";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryEntity } from "../../domain/entities/category/category.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";

export class CategoryDatasourceImp extends BaseDatasource implements CategoryDatasource {

    constructor() {
        super()
        this.audit_class = "CATEGORY"
    }
    getAll(userId: string): Promise<CategoryEntity[] | CustomResponse> {
        return this.handleErrors(async () => {
            const data = await BaseDatasource.prisma.category.findMany({
                where: {
                    AND: [
                        { deleted_at: null }, { userId }
                    ]
                }
            })
            return data.map(item => CategoryEntity.fromObject(item))
        })
    }
    create(category: CreateCategoryDto, user_audits: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            category.name = category.name.toUpperCase()
            const exist = await this.exist(category.userId, category.name)
            if (exist) {
                return new CustomResponse(`Already exist category with name: ${category.name}`, 400)
            }
            const new_category = await BaseDatasource.prisma.category.create({
                data: category,
            });
            const data = CategoryEntity.fromObject(new_category);
            this.auditSave(data, "CREATE", user_audits)
            return "Category created successfully"
        })
    }

    async exist(userId: string, nameCategory: string): Promise<boolean> {

        const data = await BaseDatasource.prisma.category.findFirst({
            where: {
                AND: [
                    { name: nameCategory },
                    { userId: userId },
                    { deleted_at: null }
                ]
            }
        });
        return !!data // Esto devolverá true si data no es nulo y false si data es nulo
    }

}