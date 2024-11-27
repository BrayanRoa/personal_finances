
import { CustomResponse } from "../../../utils/response/custom.response";
import { TransactionRepository } from "../../repositories/transaction.repository";

export interface GetYearsUseCase {
    execute(userId: string): Promise<CustomResponse | number[]>;
}

export class GetYears implements GetYearsUseCase {

    constructor(
        private repository: TransactionRepository,
    ) { }
    execute(userId: string): Promise<CustomResponse | number[]> {
        return this.repository.getYears(userId);
    }

}