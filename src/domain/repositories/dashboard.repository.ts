import { CustomResponse } from "../../utils/response/custom.response";

export abstract class DasbboardRepository{

    // informacion del header, para las cards
    abstract summaryWallets(userId: string): Promise<CustomResponse>;

    // grafico de barras de los 12 meses
    abstract summaryTransactionsByMonth(userId: string): Promise<CustomResponse>;

    abstract summaryTransactionsByCategory(userId: string): Promise<CustomResponse>;

    // tabla con informacion de cada banco
    abstract banksInformation(user:string): Promise<CustomResponse>

    // tabla con informacion de cada budget
    abstract budgetsInformation(user:string): Promise<CustomResponse>


}