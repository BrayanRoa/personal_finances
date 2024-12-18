import { container } from "../../infraestructure/dependencies/container";
import { WalletRepositoryImp } from "../../infraestructure/repositories/wallet.repository.imp";
import { BaseRouter } from "../../utils/router/base.router";
import { WalletController } from "./wallet.controller";
import { WalletMiddleware } from "./wallet.middleware";



export class WalletRoutes extends BaseRouter<WalletController, WalletMiddleware, WalletRepositoryImp> {

    constructor() {
        super(WalletController, WalletMiddleware, container.cradle.walletRepository);
    }

    routes(): void {
        const prefix = "/wallet"

        /**
         * @swagger
         * /wallet:
         *  get:
         *    tags: [Wallet]
         *    summary: Retrieves all wallets with their transactions.
         *    description: retrieves all the wallets belonging to a user, the userId is taken from the token
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
         *                      created_at:
         *                        type: string
         *                        format: date-time
         *                      updated_at:
         *                        type: string
         *                        format: date-time
         *                      deleted_at:
         *                        type: string
         *                        format: date-time
         *                      name:
         *                        type: string
         *                      description:
         *                        type: string
         *                      balance:
         *                        type: number
         *                      userId:
         *                        type: string
         *                      transactions:
         *                        type: array
         *                        items:
         *                          type: object
         *                          properties:
         *                            id:
         *                              type: integer
         *                            date:
         *                              type: string
         *                              format: date-time
         *                            amount:
         *                              type: string
         *                            description:
         *                              type: string
         *                            type:
         *                              type: string
         *                            repeat:
         *                              type: string
         *                            created_at:
         *                              type: string
         *                            updated_at:
         *                              type: string
         *                            deleted_at:
         *                              type: string
         *                            userId:
         *                              type: string
         *                            walletId:
         *                              type: integer
         *                            categoryId:
         *                              type: integer
         */
        this.router.get(`${prefix}`, this.middleware.validarJwt, this.controller.getAll)

        /**
         * @swagger
         * /wallet:
         *  post:
         *    tags: [Wallet]
         *    summary: Creates a new wallet.
         *    description: Creates a new wallet for a specific user. The userId is not needed as it is derived from the JWT of the authenticated user.
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
         *              balance:
         *                type: number
         *    responses:
         *      '201':
         *        description: Wallet created successfully
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
         *                  example: Wallet created successfully
         *      '400':
         *        description: Invalid input data
         */
        this.router.post(`${prefix}`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            (req, res, next) => this.middleware.validateDto(req, res, next, "create"),
            this.controller.create
        )

        this.router.get(`${prefix}/incomes-expenses-by-wallet`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.IncomesAndExpensesByWallet
        )

        /**
         * @swagger
         * /wallet/{id}:
         *  get:
         *    tags: [Wallet]
         *    summary: Retrieves a wallet by its ID along with its transactions.
         *    description: retrieves all the wallets belonging to a user, the userId is taken from the token
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: integer
         *        required: true
         *        description: Numeric ID of the wallet to retrieve.
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
         *                    transactions:
         *                      type: array
         *                      items:
         *                        type: object
         *                        properties:
         *                          id:
         *                            type: integer
         *                          date:
         *                            type: string
         *                            format: date-time
         *                          amount:
         *                            type: string
         *                          description:
         *                            type: string
         *                          type:
         *                            type: string
         *                          repeat:
         *                            type: string
         *                          created_at:
         *                            type: string
         *                            format: date-time
         *                          updated_at:
         *                            type: string
         *                            format: date-time
         *                          deleted_at:
         *                            type: string
         *                            format: date-time
         *                          userId:
         *                            type: string
         *                          walletId:
         *                            type: integer
         *                          categoryId:
         *                            type: integer
         *      '400':
         *        description: Invalid ID supplied
         *      '404':
         *        description: Wallet not found
         */
        this.router.get(`${prefix}/:id`, this.middleware.validarJwt, this.controller.getOne)

        /**
         * @swagger
         * /wallet/{id}:
         *  patch:
         *    tags: [Wallet]
         *    summary: Updates an existing wallet.
         *    description: Updates name or description of a wallet for a specific user. The userId is not needed as it is derived from the JWT of the authenticated user.
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: integer
         *        required: true
         *        description: Numeric ID of the wallet to update.
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
         *              balance:
         *                type: number
         *    responses:
         *      '200':
         *        description: Wallet updated successfully
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
         *                  example: Wallet updated successfully
         *      '400':
         *        description: Invalid ID supplied or invalid input data
         *      '404':
         *        description: Wallet not found
         */
        this.router.patch(`${prefix}/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            (req, res, next) => this.middleware.validateDto(req, res, next, "update"),
            this.controller.update
        )

        /**
         * @swagger
         * /wallet/{id}:
         *  delete:
         *    tags: [Wallet]
         *    summary: Deletes a wallet by ID.
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: integer
         *        required: true
         *        description: Numeric ID of the wallet to delete.
         *    responses:
         *      '200':
         *        description: Wallet deleted successfully
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
         *                  example: Wallet deleted successfully
         */
        this.router.delete(`${prefix}/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.delete
        )

        this.router.get(`${prefix}/montly-balance-wallet/:year`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.monthlyBalanceByWallet
        )


        /**
         * @swagger
         * /wallet/dashboard/{id}:
         *  get:
         *    tags: [Wallet]
         *    summary: Retrieves a wallet dashboard by ID.
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: string
         *        required: true
         *        description: String ID of the wallet to get the dashboard for.
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
         *                    totalIncomes:
         *                      type: number
         *                    totalExpenses:
         *                      type: number
         *      '404':
         *        description: Wallet not found
         */
        this.router.get(`${prefix}/dashboard/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.dashboardWallet
        )

    }
}