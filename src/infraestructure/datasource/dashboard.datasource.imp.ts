import { DashboardDatasource } from "../../domain/datasources/dashboard.datasource";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";

export class DashboardDatasourceImp extends BaseDatasource implements DashboardDatasource{
    constructor() {
        super();
        this.audit_class = "DASHBOARD";
    }
    summaryWallets(userId: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
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