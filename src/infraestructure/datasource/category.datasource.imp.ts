import { CategoryDatasource } from "../../domain/datasources/category.datasource";
import { UpdateCategoryDto } from "../../domain/dtos";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryEntity } from "../../domain/entities/category/category.entity";
import { ColorEntity } from "../../domain/entities/category/color.entity";
import { IconEntity } from "../../domain/entities/category/icon.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";

const default_categories = [
    { "name": "FOOD", "icon": "fa-utensils", "color_name": "Blue", "color": "#1c80cf" },
    { "name": "PURCHASING", "icon": "fa-cart-shopping", "color_name": "Indigo", "color": "#36459a" },
    { "name": "TRANSPORT", "icon": "fa-bus", "color_name": "Purple", "color": "#852196" },
    { "name": "HOME", "icon": "fa-house-chimney", "color_name": "Pink", "color": "#c61a54" },
    { "name": "INVOICES", "icon": "fa-receipt", "color_name": "Red", "color": "#d9362b" },
    { "name": "ENTERTAINMENT", "icon": "fa-film", "color_name": "Orange", "color": "#d06900" },
    { "name": "TRAVEL", "icon": "fa-plane", "color_name": "Amber", "color": "#FFC107" },
    { "name": "FAMILY", "icon": "fa-users", "color_name": "Yellow", "color": "#d5a326" },
    { "name": "SPORTS", "icon": "fa-medal", "color_name": "Lime", "color": "#CDDC39" },
    { "name": "BEAUTY", "icon": "fa-wand-magic-sparkles", "color_name": "Green", "color": "#419544" },
    { "name": "WORK", "icon": "fa-building", "color_name": "Teal", "color": "#008074" },
    { "name": "INITIAL AMOUNT", "icon": "fa-money-check-dollar", "color_name": "Cyan", "color": "#00a0b4" },
    { "name": "HEALTH", "icon": "fa-heart-pulse", "color_name": "Gray 1", "color": "#526a76" }, // 🏥 Nueva categoría
    { "name": "EDUCATION", "icon": "fa-graduation-cap", "color_name": "Gray 2", "color": "#607D8B" }, // 📚 Nueva categoría
    { "name": "GIFTS", "icon": "fa-gift", "color_name": "Brown", "color": "#795548" }, // 🎁 Nueva categoría
    { "name": "OTHERS", "icon": "fa-border-all", "color_name": "Black", "color": "#333333" } // 🏷️ Solo un "OTHERS"
];


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
                // Buscar el color en la base de datos
                let color = await BaseDatasource.prisma.color.findFirst({
                    where: { hex: category.color }
                });

                // Si el color no existe, crearlo
                if (!color) {
                    color = await BaseDatasource.prisma.color.create({
                        data: {
                            hex: category.color,
                            name: category.color_name,
                        },
                    });
                }

                // Buscar el icono en la base de datos
                let icon = await BaseDatasource.prisma.icon.findFirst({
                    where: { path: category.icon }
                });

                // Si el icono no existe, crearlo
                if (!icon) {
                    icon = await BaseDatasource.prisma.icon.create({
                        data: {
                            path: category.icon,
                        },
                    });
                }

                // Crear la categoría para el usuario
                await BaseDatasource.prisma.category.create({
                    data: {
                        name: category.name,
                        userId: userId,
                        colorId: color.id,
                        iconId: icon.id,
                    },
                });
            }
            return "OK";
        });
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
                },
                include: {
                    _count: {
                        select: { Transaction: true },
                    },
                    color: true,
                    icon: true,
                },
            })
            return data.map(item => CategoryEntity.fromObject(item))
        })
    }
    create(data: CreateCategoryDto): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const exist = await this.exist(data.userId, data.name)
            if (exist) return new CustomResponse(`Already exist category with name: ${data.name}`, 400)
            const new_category = await BaseDatasource.prisma.category.create({
                data: {
                    userId: data.userId,
                    name: data.name.toUpperCase(),
                    colorId: data.colorId,
                    iconId: data.iconId,
                },
            });
            const info = CategoryEntity.fromObject(new_category);
            // this.auditSave(info.id, info, "CREATE", user_audits)
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

    update(id: number, dto: UpdateCategoryDto, user_id: string): Promise<CustomResponse | CategoryEntity> {
        return this.handleErrors(async () => {
            const data = await BaseDatasource.prisma.category.update({
                where: { id },
                data: dto
            })
            if (!data) return new CustomResponse(`Don't exist category with id ${id}`, 404)
            this.auditSave(id, data, "UPDATE", user_id)
            return CategoryEntity.fromObject(data)
        })
    }

    getIcons(): Promise<CustomResponse | IconEntity[]> {
        return this.handleErrors(async () => {
            const data = await BaseDatasource.prisma.icon.findMany()
            return data.map(icon => IconEntity.fromObject(icon))
        })
    }

    getColors(): Promise<CustomResponse | ColorEntity[]> {
        return this.handleErrors(async () => {
            const data = await BaseDatasource.prisma.color.findMany()
            return data.map(color => ColorEntity.fromObject(color))
        })
    }



}