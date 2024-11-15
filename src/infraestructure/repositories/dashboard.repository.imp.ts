import { DasbboardRepository } from "../../domain/repositories/dashboard.repository";
import { CustomResponse } from "../../utils/response/custom.response";

export class DashboardRepositoryImpl implements DasbboardRepository{
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