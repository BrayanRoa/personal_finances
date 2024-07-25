import { container } from "../../infraestructure/dependencies/container";
import { BaseRouter } from "../../utils/router/base.router";
import { BudgetController } from "./budget.controller";
import { BudgetMiddleware } from "./budget.middleware";
import { BudgetRepositoryImp } from './../../infraestructure/repositories/budget.repository.imp';

export class BudgetRoutes extends BaseRouter<BudgetController, BudgetMiddleware, BudgetRepositoryImp> {

    constructor() {
        super(BudgetController, BudgetMiddleware, container.cradle.budgetRepository);
    }

    routes(): void {
        const prefix = "/budget"

        /**
         * @swagger
         * /budget:
         *  get:
         *    tags: [Budget]
         *    summary: Retrieves all budgets for a specific user.
         *    description: Retrieves all budgets created by a specific user. The userId is derived from the JWT of the authenticated user
         *    responses:
         *      '200':
         *        description: Successful operation
         *        content:
         *          application/json:
         *            schema:
         *              type: array
         *              items:
         *                type: object
         *                properties:
         *                  id:
         *                    type: string
         *                  name:
         *                    type: string
         *                  description:
         *                    type: string
         *                  date:
         *                    type: string
         *                    format: date-time
         *                  end_date:
         *                    type: string
         *                    format: date-time
         *                  amount:
         *                    type: number
         *                  userId:
         *                    type: string
         *                  created_at:
         *                    type: string
         *                    format: date-time
         *                  updated_at:
         *                    type: string
         *                    format: date-time
         *                  deleted_at:
         *                    type: string
         *                    format: date-time
         *      '400':
         *        description: Error occurred
         */
        this.router.get(`${prefix}`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.getAll
        )

        /**
         * @swagger
         * /budget:
         *  post:
         *    tags: [Budget]
         *    summary: Creates a new budget.
         *    description: Creates a new budget for a specific user. The userId is derived from the JWT of the authenticated user.
         *    requestBody:
         *      required: true
         *      content:
         *        application/json:
         *          schema:
         *            type: object
         *            properties:
         *              name:
         *                type: string
         *              description:
         *                type: string
         *              date:
         *                type: string
         *                format: date-time
         *              end_date:
         *                type: string
         *                format: date-time
         *              limit_amount:
         *                type: number
         *              current_amount:
         *                type: number
         *              repeat:
         *                type: string
         *              categories:
         *                type: string
         *              walletId:
         *                type: number
         *              percentage:
         *                type: number
         *              active:
         *                type: boolean
         *    responses:
         *      '201':
         *        description: Budget created successfully
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
         *        description: Invalid input data
         */
        this.router.post(`${prefix}`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            (req, res, next) => this.middleware.validateDto(req, res, next, "create"),
            this.controller.Create
        )

        /**
         * @swagger
         * /budget/{id}:
         *  patch:
         *    tags: [Budget]
         *    summary: Updates an existing budget.
         *    description: Updates any field of a budget for a specific user. The userId is derived from the JWT of the authenticated user.
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: string
         *        required: true
         *        description: ID of the budget to update.
         *    requestBody:
         *      required: true
         *      content:
         *        application/json:
         *          schema:
         *            type: object
         *            properties:
         *              name:
         *                type: string
         *              description:
         *                type: string
         *              limit_amount:
         *                type: number
         *              repeat:
         *                type: string
         *              active:
         *                type: boolean
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
        this.router.patch(`${prefix}/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            (req, res, next) => this.middleware.validateDto(req, res, next, "update"),
            this.controller.update
        )

        /**
         * @swagger
         * /budget/{id}:
         *  delete:
         *    tags: [Budget]
         *    summary: Soft deletes a budget.
         *    description: Soft deletes a budget for a specific user. The budget is not permanently removed from the database. The userId is derived from the JWT of the authenticated user.
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: string
         *        required: true
         *        description: ID of the budget to be soft deleted.
         *    responses:
         *      '204':
         *        description: Budget deleted successfully
         *      '400':
         *        description: Invalid ID supplied
         *      '404':
         *        description: Budget not found
         */
        this.router.delete(`${prefix}/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.delete
        )

    }

}