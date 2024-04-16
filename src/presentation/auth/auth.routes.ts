import { AuthDatasourceImp } from "../../infraestructure/datasource/auth.datasource.imp";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/auth.repository.imp";
import { BcryptPasswordHasher } from "../../utils/passwordHasher/bcryptPasswordHasher";
import { BaseRouter } from "../../utils/router/base.router";
import { AuthMiddleware } from "./aurth.middleware";
import { AuthController } from "./auth.controller";


export class AuthRoutes extends BaseRouter<AuthController, AuthMiddleware, AuthRepositoryImpl> {

    constructor() {
        super(
            AuthController,
            AuthMiddleware,
            new AuthRepositoryImpl(
                new AuthDatasourceImp(),
                new BcryptPasswordHasher()
            )
        );
    }

    routes(): void {
        const prefix = "/auth"

        // OJO, AQUI LE PASO UN CUARTO ARGUMENTO PORQUE EN ESTE CASO AMBOS SON DE TIPO POST (login y register) 
        // Y NO PODRIA DIFERENCIARLOS POR EL TIPO DE PETICIÓN

        /**
         * @swagger
         * /auth/login:
         *  post:
         *    tags: [Auth]  
         *    summary: Autentica un usuario y retorna un token.
         *    requestBody:
         *      required: true
         *      content:
         *        application/json:
         *          schema:
         *            type: object
         *            properties:
         *              email:
         *                type: string
         *                example: example@email.com
         *              password:
         *                type: string
         *                example: mypassword
         *    responses:
         *      '200':
         *        description: Inicio de sesión exitoso
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
         *                    msg:
         *                      type: string
         *                      example: user logged successfully
         *                    token:
         *                      type: string
         *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ5ZGY5NjE2LThkMTAtNDk5Mi1hMjBhLTg5NzRkMzA0ODFhOCIsImlhdCI6MTcxMzIxNzc4OCwiZXhwIjoxNzEzMjI0OTg4fQ.sOsR27coMtrWEopapYliWFXPmDen2by8zVX645iuomc
         */
        this.router.post(`${prefix}/login`,
            (req, res, next) => this.middleware.validateDto(req, res, next, "update"),
            this.controller.login
        )

        /**
        * @swagger
        * /auth/register:
        *  post:
        *    tags: [Auth]  
        *    summary: register a user
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
        *                example: example@email.com
        *              password:
        *                type: string
        *                example: mypassword
        *    responses:
        *      '200':
        *        description: user created successfully
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
        *                  example: CREATED
        *                data: 
        *                  type: string
        */ 
        this.router.post(`${prefix}/register`,
            (req, res, next) => this.middleware.validateDto(req, res, next, "create"),
            this.controller.register
        )
        
        this.router.get(`${prefix}/validate-email/:token`, this.controller.validateEmail)
    }
}