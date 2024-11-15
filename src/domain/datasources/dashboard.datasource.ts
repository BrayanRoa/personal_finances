import { CustomResponse } from "../../utils/response/custom.response";
import { SummaryWalletEntity } from "../entities/dashboard/summary-wallets.entity";

export abstract class DashboardDatasource{

    // informacion del header, para las cards
    abstract summaryWallets(userId: string): Promise<CustomResponse | SummaryWalletEntity>;

    // grafico de barras de los 12 meses
    abstract summaryTransactionsByMonth(userId: string): Promise<CustomResponse>;

    abstract summaryTransactionsByCategory(userId: string): Promise<CustomResponse>;

    // tabla con informacion de cada banco
    abstract banksInformation(user:string): Promise<CustomResponse>

    // tabla con informacion de cada budget
    abstract budgetsInformation(user:string): Promise<CustomResponse>


}