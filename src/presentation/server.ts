import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { UserRoutes } from './users/users.routes';
import { AuthRoutes } from './auth/auth.routes'
import { envs } from '../config/envs';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from '../utils/swagger/swaggerOptions';

export class Server {

    public readonly app: Application;
    private serverListener?: any;
    private readonly port: number
    private readonly public_path: string

    constructor() {
        this.app = express();
        this.port = envs.PORT;
        this.public_path = envs.PUBLIC_PATH
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
        this.middlewares()
        this.app.use("/api/v1", this.routers())
        // this.listen()
    }

    middlewares() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.static(this.public_path));
        this.app.use(cors())
        this.app.use(morgan("dev"))
    }

    routers(): express.Router[] {
        return [
            new UserRoutes().router,
            new AuthRoutes().router,
            // new AuthRouter().router,
            // new PersonRouter().router,
            // new DocumentTypeRouter().router,
            // new RoleRouter().router
        ]
    }

    listen() {
        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port: ${this.port} - http://localhost:${this.port}`);
        })
    }

    // ESTE MÉTODO ES PARA CANCELAR EL SERVIDOR, ESTO LO USO EN EL TESTING
    close() {
        this.serverListener?.close()
    }
}