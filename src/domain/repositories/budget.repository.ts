import { CustomResponse } from "../../utils/response/custom.response";
import { CreateBudgetDto } from "../dtos/budget/create-budget.dto";
import { UpdateBudgetDto } from "../dtos/budget/update-budget.dto";
import { BudgetEntity } from "../entities/budget/budget.entity";

export abstract class BudgetRepository {

    abstract getAll(userId: string): Promise<BudgetEntity[] | CustomResponse>;
    abstract create(data: CreateBudgetDto): Promise<string | CustomResponse>;
    abstract createMany(data: CreateBudgetDto[] | CreateBudgetDto): Promise<string | CustomResponse>

    abstract getOne(id: number, userId: string): Promise<BudgetEntity | CustomResponse>
    abstract get_one_by_date(walletid: number, categoryid: number, userid: string): Promise<BudgetEntity[] | CustomResponse>

    abstract update(id: number, data: UpdateBudgetDto[] | UpdateBudgetDto): Promise<string | CustomResponse>
    abstract getAllRecurring(): Promise<CustomResponse | BudgetEntity[]>


}