import { BaseRouter } from "../../utils/router/base.router";
import { container } from "../../infraestructure/dependencies/container";
import { DashboardController } from "./dashboard.controller";
import { DashboardMiddleware } from "./dashboard.middleware";
import { DashboardRepositoryImpl } from "../../infraestructure/repositories/dashboard.repository.imp";
import { summaryTransactionsMonthUseCase } from '../../domain/use-cases/dashboard/summary-transactions-months';

export class DashboardRoutes extends BaseRouter<DashboardController, DashboardMiddleware, DashboardRepositoryImpl> {

    constructor() {
        super(DashboardController, DashboardMiddleware, container.cradle.dashboardRepository);
    }

    routes(): void {
        const prefix = "/dashboard";

        this.router.get(`${prefix}/summary-wallets`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.summaryWallets
        )

        this.router.get(`${prefix}/summary-transaction-month/:year`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.transactionMonths
        )

        this.router.get(`${prefix}/summary-category-transaction`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.countCategoryTransactions
        )

        this.router.get(`${prefix}/summary-budget-information`,
            (req, res, next) => this.middleware.validarJwt(req, res, next),
            this.controller.budgetInformation
        )
    }


}