import { container } from "../../infraestructure/dependencies/container";
import { CategoryRepositoryImp } from "../../infraestructure/repositories/category.repository.imp";
import { BaseRouter } from "../../utils/router/base.router";
import { CategoryController } from "./category.controller";
import { CategoryMiddleware } from "./category.middleware";

export class CategoryRoutes extends BaseRouter<CategoryController, CategoryMiddleware, CategoryRepositoryImp> {

    constructor() {
        super(CategoryController, CategoryMiddleware, container.cradle.categoryRepository);
    }

    routes(): void {
        const prefix = "/category"

        this.router.get(`${prefix}/icons`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.getIcons
        )

        this.router.get(`${prefix}/colors`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.getColors
        )


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
         *              icon: 
         *                type: string
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
         * /category/{id}:
         *  patch:
         *    tags: [Categories]
         *    summary: delete categories without transaction
         *    description: Updates any field of a budget for a specific user. The userId is derived from the JWT of the authenticated user.
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: string
         *        required: true
         *        description: ID of the budget to delete.
         *    responses:
         *      '200':
         *        description: Budget updated successfully
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                status:
         *                  type: integer
         *                statusMsg:
         *                  type: string
         *                data:
         *                  type: string
         *      '400':
         *        description: Invalid ID supplied or invalid input data
         *      '404':
         *        description: Budget not found
         */
        this.router.delete(`${prefix}/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.delete
        )

        this.router.patch(`${prefix}/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            (req, res, next) => this.middleware.validateDto(req, res, next, "update"),
            this.controller.update
        )

        /**
         * @swagger
         * /category:
         *  get:
         *    tags: [Categories]
         *    summary: Retrieves all categories.
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
         *                      icon: 
         *                        type: string
         *                      userId:
         *                        type: string
         *                        example: 7e05dd99-5912-48a1-b5bb-bb44ca8aa8cf
         */
        this.router.get(`${prefix}`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.getAll
        )

        /**
         * @swagger
         * /category/{id}:
         *  get:
         *    tags: [Categories]
         *    summary: Retrieves a category by its ID.
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: integer
         *        required: true
         *        description: Numeric ID of the category to retrieve.
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
         *                statusMsg:
         *                  type: string
         *                data:
         *                  type: object
         *                  properties:
         *                    id:
         *                      type: integer
         *                    created_at:
         *                      type: string
         *                      format: date-time
         *                    updated_at:
         *                      type: string
         *                      format: date-time
         *                    deleted_at:
         *                      type: string
         *                      format: date-time
         *                    name:
         *                      type: string
         *                    description:
         *                      type: string
         *                    userId:
         *                      type: string
         *                    icon: 
         *                      type: string
         *      '400':
         *        description: Invalid ID supplied
         *      '404':
         *        description: Category not found
         */
        this.router.get(`${prefix}/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.getOne
        )




        /**
         * @swagger
         * /category/{walletId}/countTransaction:
         *  get:
         *    tags: [Categories]
         *    summary: Retrieves the count of transactions by category for a specific wallet.
         *    parameters:
         *      - in: path
         *        name: walletId
         *        schema:
         *          type: number
         *        required: true
         *        description: String ID of the wallet to get the count of transactions by category.
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
         *                statusMsg:
         *                  type: string
         *                data:
         *                  type: object
         *                  properties:
         *                      name:
         *                        type: string
         *                      transactionCount:
         *                        type: number  
        *      '404':
         *        description: Wallet not found
         */
        // this.router.get(`${prefix}/:walletId/countTransaction`,
        //     (req, res, next) => this.middleware.validarJwt(req, res, next),
        //     this.controller.transactionByCategory
        // )
    }

}