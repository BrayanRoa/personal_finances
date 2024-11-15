import { BaseRouter } from "../../utils/router/base.router";
import { container } from "../../infraestructure/dependencies/container";
import { DashboardController } from "./dashboard.controller";
import { DashboardMiddleware } from "./dashboard.middleware";
import { DashboardRepositoryImpl } from "../../infraestructure/repositories/dashboard.repository.imp";

export class DashboardRoutes extends BaseRouter<DashboardController, DashboardMiddleware, DashboardRepositoryImpl> {

    constructor() {
        super(DashboardController, DashboardMiddleware, container.cradle.dashboardRepository);
    }

    routes(): void {
        const prefix = "/dashboard";
    }

}