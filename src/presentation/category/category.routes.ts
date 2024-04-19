import { CategoryDatasourceImp } from "../../infraestructure/datasource/category.datasource.imp";
import { CategoryRepositoryImp } from "../../infraestructure/repositories/category.repository.imp";
import { BaseRouter } from "../../utils/router/base.router";
import { CategoryController } from "./category.controller";
import { CategoryMiddleware } from "./category.middleware";

export class CategoryRoutes extends BaseRouter<CategoryController, CategoryMiddleware, CategoryRepositoryImp> {

    constructor() {
        super(CategoryController, CategoryMiddleware, new CategoryRepositoryImp(new CategoryDatasourceImp()));
    }

    routes(): void {
        const prefix = "/category"

        /**
         * @swagger
         * /category:
         *  post:
         *    tags: [Categories]
         *    summary: Create a new category.
         *    description: Creates a new category for a specific user
         *    requestBody:
         *      required: true
         *      content:
         *        application/json:
         *          schema:
         *            type: object
         *            properties:
         *              name:
         *                type: string
         *                example: Food
         *              userId:
         *                type: string
         *                example: 7e05dd99-5912-48a1-b5bb-bb44ca8aa8cf
         *    responses:
         *      '201':
         *        description: Category created successfully
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                status:
         *                  type: integer
         *                  example: 201
         *                statusMsg:
         *                  type: string
         *                  example: SUCCESS
         *                msg:
         *                  type: string
         *                  example: Category created successfully
         *      '400':
         *        description: Datos de entrada no válidos
         */
        this.router.post(`${prefix}`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            (req, res, next) => this.middleware.validateDto(req, res, next, "create"),
            this.controller.Create
        )


        /**
         * @swagger
         * /category:
         *  get:
         *    tags: [Categories]
         *    summary: Retrieves all categories.
         *    parameters:
         *    
         *    responses:
         *      '200':
         *        description: Successful operation
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                status:
         *                  type: integer
         *                  example: 200
         *                statusMsg:
         *                  type: string
         *                  example: SUCCESS
         *                data:
         *                  type: array
         *                  items:
         *                    type: object
         *                    properties:
         *                      id:
         *                        type: integer
         *                        example: 12
         *                      created_at:
         *                        type: string
         *                        format: date-time
         *                        example: 2024-04-19T00:15:35.666Z
         *                      updated_at:
         *                        type: string
         *                        format: date-time
         *                        example: 2024-04-19T00:15:35.666Z
         *                      deleted_at:
         *                        type: string
         *                        format: date-time
         *                      name:
         *                        type: string
         *                        example: Food
         *                      userId:
         *                        type: string
         *                        example: 7e05dd99-5912-48a1-b5bb-bb44ca8aa8cf
         */
        this.router.get(`${prefix}`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.getAll
        )
    }

}