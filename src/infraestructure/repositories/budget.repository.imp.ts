import { BudgetDatasource } from "../../domain/datasources/budget.datasource";
import { CreateBudgetDto } from "../../domain/dtos/budget/create-budget.dto";
import { BudgetEntity } from "../../domain/entities/budget/budget.entity";
import { BudgetRepository } from "../../domain/repositories/budget.repository";
import { CustomResponse } from "../../utils/response/custom.response";

export class BudgetRepositoryImp implements BudgetRepository {

    constructor(
        private readonly budgetDatasource: BudgetDatasource
    ) { }
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