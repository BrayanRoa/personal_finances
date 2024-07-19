import { BudgetDatasource } from "../../domain/datasources/budget.datasource";
import { CreateBudgetDto } from "../../domain/dtos/budget/create-budget.dto";
import { UpdateBudgetDto } from "../../domain/dtos/budget/update-budget.dto";
import { BudgetEntity } from "../../domain/entities/budget/budget.entity";
import { BudgetRepository } from "../../domain/repositories/budget.repository";
import { CustomResponse } from "../../utils/response/custom.response";

export class BudgetRepositoryImp implements BudgetRepository {

    constructor(
        private readonly budgetDatasource: BudgetDatasource
    ) { }
    update(id: number, data: UpdateBudgetDto, user_audits: string): Promise<string | CustomResponse> {
        return this.budgetDatasource.update(id, data, user_audits)
    }
    get_one_by_date(walletid: number, categoryid: number, userid: string): Promise<BudgetEntity[] | CustomResponse> {
        return this.budgetDatasource.get_one_by_date(walletid, categoryid, userid)
    }
    getOne(id: number, userId: string): Promise<BudgetEntity | CustomResponse> {
        return this.budgetDatasource.getOne(id, userId)
    }
    getAll(userId: string): Promise<BudgetEntity[] | CustomResponse> {
        return this.budgetDatasource.getAll(userId)
    }
    async create(data: CreateBudgetDto, user_audits: string): Promise<string | CustomResponse> {
        data.initial_date = new Date(data.initial_date);
        data.end_date = new Date(data.end_date);
        if (data.initial_date.getTime() > data.end_date.getTime()) {
            return new CustomResponse('The initial date must be before the end date', 400)
        }
        return this.budgetDatasource.create(data, user_audits)
    }

}