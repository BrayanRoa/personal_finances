import { TransactionRepositoryImp } from "../../infraestructure/repositories/transaction.repository.imp";
import { BaseRouter } from "../../utils/router/base.router";
import { TransactionController } from "./transaction.controller";
import { TransactionMiddleware } from "./transaction.middleware";
import { container } from "../../infraestructure/dependencies/container";

export class TransactionRoutes extends BaseRouter<TransactionController, TransactionMiddleware, TransactionRepositoryImp> {

    constructor() {
        super(TransactionController, TransactionMiddleware, container.cradle.transactionRepository);
    }

    routes(): void {
        const prefix = "/transaction";

        /**
         * @swagger
         * /transaction:
         *  get:
         *    tags: [Transactions]
         *    summary: Retrieves all transactions.
         *    parameters:
         *      - in: query
         *        name: page
         *        schema:
         *          type: integer
         *          default: 1
         *        description: Page number for the results pagination.
         *      - in: query
         *        name: per_page
         *        schema:
         *          type: integer
         *          default: 10
         *        description: Number of results to return per page.
         *      - in: query
         *        name: search
         *        schema:
         *          type: string
         *        description: Search for transactions by description.
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
         *                        example: 5
         *                      created_at:
         *                        type: string
         *                        format: date-time
         *                        example: 2024-04-19T22:52:03.071Z
         *                      updated_at:
         *                        type: string
         *                        format: date-time
         *                        example: 2024-04-19T22:52:03.071Z
         *                      deleted_at:
         *                        type: string
         *                        format: date-time
         *                      date:
         *                        type: string
         *                        format: date-time
         *                        example: 2024-04-20T00:00:00.000Z
         *                      amount:
         *                        type: string
         *                        example: 1111
         *                      description:
         *                        type: string
         *                        example: aja
         *                      type:
         *                        type: string
         *                        example: INCOME
         *                      repeat:
         *                        type: string
         *                        example: NEVER
         *                      active:
         *                        type: boolean
         *                      next_date:
         *                        type: date
         *                      userId:
         *                        type: string
         *                        example: 5246729c-5efb-44b1-8942-2c7fc082a916
         *                      walletId:
         *                        type: integer
         *                        example: 2
         *                      categoryId:
         *                        type: integer
         *                        example: 1
         */
        this.router.get(`${prefix}`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.getAll
        )

        /**
         * @swagger
         * /transaction/{id}:
         *  get:
         *    tags: [Transactions]
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
         *                    date:
         *                      type: string
         *                      format: date-time
         *                    amount:
         *                      type: string
         *                    description:
         *                      type: string
         *                    type:
         *                      type: string
         *                    repeat:
         *                      type: string
         *                    active:
         *                      type: boolean
         *                    next_date:
         *                      type: date
         *                    userId:
         *                      type: string
         *                    walletId:
         *                      type: integer
         *                    categoryId:
         *                      type: integer
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
         * /transaction:
         *  post:
         *    tags: [Transactions]
         *    summary: Create a new transaction.
         *    requestBody:
         *      required: true
         *      content:
         *        application/json:
         *          schema:
         *            type: object
         *            properties:
         *              date:
         *                  type: string
         *              amount:
         *                  type: number
         *              description:    
         *                  type: string    
         *              type:
         *                  type: string
         *              repeat:
         *                  type: string
         *              walletId:
         *                  type: number
         *              categoryId:
         *                  type: number
         *              active:
         *                  type: boolean 
         *    responses:
         *      '201':
         *        description: Transaction created successfully
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
         *                data:
         *                  type: object
         *      '400':
         *        description: Invalid input data
         */
        this.router.post(`${prefix}`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            (req, res, next) => this.middleware.validateDto(req, res, next, "create"),
            this.controller.create)

        /**
         * @swagger
         * /transaction/{id}:
         *  patch:
         *    tags: [Transactions]
         *    summary: Updates an existing transaction.
         *    description: Updates any field of a transaction for a specific user. The userId is not needed as it is derived from the JWT of the authenticated user.
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: number
         *        required: true
         *        description: Numeric ID of the transaction to update
         *    requestBody:
         *      required: true
         *      content:
         *        application/json:
         *          schema:
         *            type: object
         *            properties:
         *              date:
         *                type: string
         *                format: date-time
         *                example: 2024-04-20T00:00:00.000Z
         *              amount:
         *                type: string
         *                example: 1111
         *              description:
         *                type: string
         *                example: aja
         *              type:
         *                type: string
         *                example: INCOME
         *              repeat:
         *                type: string
         *                example: NEVER
         *              walletId:
         *                type: integer
         *                example: 2
         *              categoryId:
         *                type: integer
         *                example: 1
         *    responses:
         *      '200':
         *        description: Transaction updated successfully
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
         *                  type: object
         *                  properties:
         *                    //... specific properties of the updated transaction
         *      '400':
         *        description: Invalid input data
         */
        this.router.patch(`${prefix}/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            (req, res, next) => this.middleware.validateDto(req, res, next, "update"),
            this.controller.update
        )

        /**
         * @swagger
         * /transaction/{id}:
         *  delete:
         *    tags: [Transactions]
         *    summary: Deletes a transaction by ID.
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: number
         *        required: true
         *        description: Numeric ID of the transaction to delete
         *    responses:
         *      '204':
         *        description: Transaction deleted successfully
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                status:
         *                  type: integer
         *                  example: 204
         *                statusMsg:
         *                  type: string
         *                  example: DELETED
         *                data:
         *                  type: object
         */
        this.router.delete(`${prefix}/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.delete)
    }

}