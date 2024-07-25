import { CategoryDatasource } from "../../domain/datasources/category.datasource";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryEntity } from "../../domain/entities/category/category.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";

const default_categories = [
    { "name": "FOOD", "icon": "fast-food-outline" },
    { "name": "PURCHASING", "icon": "cart-outline" },
    { "name": "TRANSPORT", "icon": "car-outline" },
    { "name": "HOME", "icon": "home-outline" },
    { "name": "INVOICES", "icon": "card-outline" },
    { "name": "ENTERTAINMENT", "icon": "musical-notes-outline" },
    { "name": "TRAVEL", "icon": "airplane-outline" },
    { "name": "FAMILY", "icon": "people-circle-outline" },
    { "name": "SPORTS", "icon": "american-football-outline" },
    { "name": "BEAUTY", "icon": "rose-outline" },
    { "name": "WORK", "icon": "business-outline" },
    { "name": "OTHERS", "icon": "list-outline" }
]

export class CategoryDatasourceImp extends BaseDatasource implements CategoryDatasource {

    constructor() {
        super()
        this.audit_class = "CATEGORY"
    }
    delete(id: number, userId: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            await BaseDatasource.prisma.category.update({
                where: {
                    id,
                    userId
                },
                data: { deleted_at: new Date() },
            })
            return "Category deleted successfully"
        })
    }
    defaultCategories(userId: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            for (const category of default_categories) {
                await BaseDatasource.prisma.category.create({
                    data: {
                        name: category.name,
                        icon: category.icon,
                        userId: userId,
                    },
                });
            }
            return "OK"
        })
    }
    getOne(id: number, userId: string): Promise<CategoryEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const category = await BaseDatasource.prisma.category.findFirst({
                where: {
                    AND: [
                        { id },
                        { deleted_at: null },
                        { userId }
                    ]
                }
            })
            if (!category) return new CustomResponse(`Don't exist category with id ${id}`, 404)
            return CategoryEntity.fromObject(category)
        })
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
    create(data: CreateCategoryDto, user_audits: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const exist = await this.exist(data.userId, data.name)
            if (exist) return new CustomResponse(`Already exist category with name: ${data.name}`, 400)
            const new_category = await BaseDatasource.prisma.category.create({
                data,
            });
            const info = CategoryEntity.fromObject(new_category);
            this.auditSave(info.id, info, "CREATE", user_audits)
            return "Category created successfully"
        })
    }

    async exist(userId: string, nameCategory: string): Promise<boolean> {

        const data = await BaseDatasource.prisma.category.findFirst({
            where: {
                AND: [
                    { name: nameCategory.toUpperCase() },
                    { userId: userId },
                    { deleted_at: null }
                ]
            }
        });
        return !!data // Esto devolverá true si data no es nulo y false si data es nulo
    }

}