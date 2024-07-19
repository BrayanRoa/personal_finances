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
         *                  initial_date:
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
         *              initial_date:
         *                type: string
         *                format: date-time
         *              end_date:
         *                type: string
         *                format: date-time
         *              limit_amount:
         *                type: number
         *              current_amount:
         *                type: number
         *              categories:
         *                type: string
         *              wallets:
         *                type: string
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

    }

}