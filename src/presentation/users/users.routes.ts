import { UserMiddleware } from "./user.middleware";
import { UserRepositoryImpl } from "../../infraestructure/repositories/user.repository.imp";
import { BaseRouter } from "../../utils/router/base.router";
import { UserController } from "./user.controller";
import { container } from "../../infraestructure/dependencies/container";


export class UserRoutes extends BaseRouter<UserController, UserMiddleware, UserRepositoryImpl> {

    constructor() {
        super(UserController, UserMiddleware, container.cradle.userRepository);
    }

    routes(): void {
        const prefix = "/users"
        /**
         * @swagger
         * /users:
         *  get:
         *    tags: [Users]
         *    description: get all users
         *    responses:
         *      '200':
         *        description: response successful
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
         *                        type: string
         *                        example: d9df9616-8d10-4992-a20a-8974d30481a8
         *                      created_at:
         *                        type: string
         *                        format: date-time
         *                        example: 2024-04-11T03:44:40.257Z
         *                      updated_at:
         *                        type: string
         *                        format: date-time
         *                        example: 2024-04-11T03:45:02.276Z
         *                      deleted_at:
         *                        type: string
         *                        format: date-time
         *                      name:
         *                        type: string
         *                        example: brayan
         *                      email:
         *                        type: string
         *                        example: brayanandresrl@ufps.edu.co
         *                      email_sent:
         *                        type: boolean
         *                        example: true
         *                      emailValidated:
         *                        type: boolean
         *                        example: true
         */
        this.router.get(`${prefix}`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.get
        )

        /**
         * @swagger
         * /users/{id}:
         *  get:
         *    tags: [Users]
         *    summary: Obtiene un usuario por su ID
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: string
         *        required: true
         *        description: ID del usuario
         *    responses:
         *      '200':
         *        description: Operación exitosa
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
         *                    id:
         *                      type: string
         *                      example: d9df9616-8d10-4992-a20a-8974d30481a8
         *                    created_at:
         *                      type: string
         *                      format: date-time
         *                      example: 2024-04-11T03:44:40.257Z
         *                    updated_at:
         *                      type: string
         *                      format: date-time
         *                      example: 2024-04-11T03:45:02.276Z
         *                    deleted_at:
         *                      type: string
         *                      format: date-time
         *                    name:
         *                      type: string
         *                      example: brayan
         *                    email:
         *                      type: string
         *                      example: brayanandresrl@ufps.edu.co
         *                    email_sent:
         *                      type: boolean
         *                      example: true
         *                    emailValidated:
         *                      type: boolean
         *                      example: true
         */
        this.router.get(`${prefix}/:id`,
            // (req, res, next) => this.middleware.validarJwt(req, res, next), 
            [this.middleware.validarJwt],
            this.controller.getOne
        )

        
        this.router.post(`${prefix}`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            (req, res, next) => this.middleware.validateDto(req, res, next, "create"),
            this.controller.create
        )

        /**
         * @swagger
         * /users/{id}:
         *  patch:
         *    tags: [Users]
         *    summary: Updates an existing user.
         *    description: Updates any field of a user profile for a specific user. The userId is derived from the JWT of the authenticated user.
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: string
         *        required: true
         *        description: Numeric ID of the user to update.
         *    requestBody:
         *      required: true
         *      content:
         *        application/json:
         *          schema:
         *            type: object
         *            properties:
         *              name:
         *                type: string
         *              email:
         *                type: string
         *              password:
         *                type: string
         *    responses:
         *      '200':
         *        description: User updated successfully
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
         *                  
         *      '400':
         *        description: Invalid ID supplied or invalid input data
         *      '404':
         *        description: User not found
         */
        this.router.patch(`${prefix}/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            (req, res, next) => this.middleware.validateDto(req, res, next, "update"),
            this.controller.update
        )

        /**
         * @swagger
         * /users/{id}:
         *  delete:
         *    tags: [Users]
         *    summary: Deletes a user by ID.
         *    parameters:
         *      - in: path
         *        name: id
         *        schema:
         *          type: string
         *        required: true
         *        description: Numeric ID of the user to delete.
         *    responses:
         *      '200':
         *        description: User deleted successfully
         *      '400':
         *        description: Invalid ID supplied
         *      '404':
         *        description: User not found
         */
        this.router.delete(`${prefix}/:id`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.delete
        )
    }
}