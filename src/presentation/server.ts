import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { UserRoutes } from './users/users.routes';
import { AuthRoutes } from './auth/auth.routes'
import { envs } from '../config/envs';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from '../utils/swagger/swaggerOptions';
import { CategoryRoutes } from './category/category.routes';
import { TransactionRoutes } from './transaction/transaction.routes';
import { WalletRoutes } from './wallet/wallet.routes';
import cron from 'node-cron';
// import { budgetsRecurring, budgetsToBeDeactivated, transactionsRecurring } from '../works/processRecurringTransactions';
import { BudgetRoutes } from './budget/budget.routes';
import { DashboardRoutes } from './dashboard/dashboard.routes';
import { budgetsRecurring, budgetsToBeDeactivated, transactionsRecurring } from '../works/processRecurringTransactions';

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
        this.scheduleCronJobs()
        // this.listen()
    }

    scheduleCronJobs() {
        cron.schedule('0 * * * *', async () => {
            await transactionsRecurring();
        });

        cron.schedule('0 * * * *', async () => {
            await budgetsRecurring();
        });
        // cron.schedule('* * * * * *', async () => {
        //     await budgetsToBeDeactivated()
        // })

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
            new CategoryRoutes().router,
            new TransactionRoutes().router,
            new WalletRoutes().router,
            new BudgetRoutes().router,
            new DashboardRoutes().router,
        ]
    }

    listen() {
        this.serverListener = this.app.listen(this.port, "0.0.0.0", () => {
            console.log(`✅ Server running on port: ${this.port}!!!`);
        });

    }

    // ESTE MÉTODO ES PARA CANCELAR EL SERVIDOR, ESTO LO USO EN EL TESTING
    close() {
        this.serverListener?.close()
    }
}