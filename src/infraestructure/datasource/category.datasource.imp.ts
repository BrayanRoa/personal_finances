import { CategoryDatasource } from "../../domain/datasources/category.datasource";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryEntity } from "../../domain/entities/category/category.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { TransactionByCategory } from "../../utils/interfaces/count_transaction_by_category.interface";
import { CustomResponse } from "../../utils/response/custom.response";

const default_categories = [
    { "name": "FOOD", "icon": "fast-food-outline", "color": "#FF5733" },
    { "name": "PURCHASING", "icon": "cart-outline", "color": "#33FF57" },
    { "name": "TRANSPORT", "icon": "car-outline", "color": "#3357FF" },
    { "name": "HOME", "icon": "home-outline", "color": "#FF33A1" },
    { "name": "INVOICES", "icon": "card-outline", "color": "#FFD700" },
    { "name": "ENTERTAINMENT", "icon": "musical-notes-outline", "color": "#8A2BE2" },
    { "name": "TRAVEL", "icon": "airplane-outline", "color": "#FF7F50" },
    { "name": "FAMILY", "icon": "people-circle-outline", "color": "#6495ED" },
    { "name": "SPORTS", "icon": "american-football-outline", "color": "#7FFF00" },
    { "name": "BEAUTY", "icon": "rose-outline", "color": "#DC143C" },
    { "name": "WORK", "icon": "business-outline", "color": "#FF8C00" },
    { "name": "INITIAL AMOUNT", "icon": "business-outline", "color": "#FF8C01" },
    { "name": "OTHERS", "icon": "list-outline", "color": "#00CED1" }
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
                        color: category.color,
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


    //TODO: ESTA SE PODRIA BORRAR PORQUE YA TENGO UNO EN DASHBOARD
    transactionWithCategoriesAndAmount(userId: string, walletId: number): Promise<TransactionByCategory[] | CustomResponse> {
        return this.handleErrors(async () => {
            const data = await BaseDatasource.prisma.category.findMany({
                select: {
                    name: true,
                    Transaction: {
                        select: {
                            id: true,
                            wallet: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                        where: {
                            deleted_at: null,
                            walletId // reemplace `yourWalletId` con la ID de la cartera que está buscando
                        }
                    },
                },
                where: {
                    userId,
                    deleted_at: null
                }
            });
            const categoryCounts = data.map(category => ({
                name: category.name,
                transactionCount: category.Transaction.length,
            }))
            return categoryCounts
        })
    }

}