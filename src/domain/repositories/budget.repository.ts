import { CustomResponse } from "../../utils/response/custom.response";
import { CreateBudgetDto } from "../dtos/budget/create-budget.dto";
import { BudgetEntity } from "../entities/budget/budget.entity";

export abstract class BudgetRepository {

    abstract getAll(userId: string): Promise<BudgetEntity[] | CustomResponse>;
    abstract create(data: CreateBudgetDto, user_audits: string): Promise<string | CustomResponse>;
}