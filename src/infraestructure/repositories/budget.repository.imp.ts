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
    createMany(data: CreateBudgetDto[]): Promise<string | CustomResponse> {
        return this.budgetDatasource.createMany(data)
    }
    getAllRecurring(): Promise<CustomResponse | BudgetEntity[]> {
        return this.budgetDatasource.getAllRecurring()
    }
    update(id: number, data: UpdateBudgetDto): Promise<string | CustomResponse> {
        return this.budgetDatasource.update(id, data)
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
    // async create(data: CreateBudgetDto[]): Promise<string | CustomResponse> {
    //     data.date = new Date(data.date);
    //     data.end_date = new Date(data.end_date);
    //     if (data.date.getTime() > data.end_date.getTime()) {
    //         return new CustomResponse('The initial date must be before the end date', 400)
    //     }
    //     return this.budgetDatasource.create(data, user_audits)
    // }

    create(data: CreateBudgetDto): Promise<string | CustomResponse> {
        if (data instanceof Array) {
            data.forEach(element => {
                element.date = new Date(element.date)
                element.end_date = new Date(element.end_date)
            });
        } else {
            data.date = new Date(data.date)
            data.end_date = new Date(data.end_date)
        }
        return this.budgetDatasource.create(data)
    }

}