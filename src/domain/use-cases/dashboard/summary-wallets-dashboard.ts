import { CustomResponse } from "../../../utils/response/custom.response";
import { DasbboardRepository } from "../../repositories/dashboard.repository";

export interface SummaryWaletUseCase {
    execute(userId: string): Promise<CustomResponse>;
}

export class SummaryWalet implements SummaryWaletUseCase {
    constructor(
        private repository: DasbboardRepository,
    ) { }
    execute(userId: string): Promise<CustomResponse> {
        throw new Error("Method not implemented.");
    }

}