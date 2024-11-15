import { DashboardDatasource } from "../../domain/datasources/dashboard.datasource";
import { SummaryWalletEntity } from "../../domain/entities/dashboard/summary-wallets.entity";
import { DasbboardRepository } from "../../domain/repositories/dashboard.repository";
import { CustomResponse } from "../../utils/response/custom.response";

export class DashboardRepositoryImpl implements DasbboardRepository{

    constructor(
        private readonly dashboardDatasource: DashboardDatasource
    ) {
        
    }
    summaryWallets(userId: string): Promise<CustomResponse | SummaryWalletEntity> {
        return this.dashboardDatasource.summaryWallets(userId)
    }
    summaryTransactionsByMonth(userId: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
    }
    summaryTransactionsByCategory(userId: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
    }
    banksInformation(user: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
    }
    budgetsInformation(user: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
    }

}