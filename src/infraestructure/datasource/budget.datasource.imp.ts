import { BudgetDatasource } from "../../domain/datasources/budget.datasource";
import { CreateBudgetDto } from "../../domain/dtos/budget/create-budget.dto";
import { BudgetEntity } from "../../domain/entities/budget/budget.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";

export class BudgetDatasourceImp extends BaseDatasource implements BudgetDatasource {

    constructor() {
        super()
        this.audit_class = "BUDGET"
    }
    getAll(userId: string): Promise<BudgetEntity[] | CustomResponse> {
        console.log("hola");
        return this.handleErrors(async () => {
            const budgets = await BaseDatasource.prisma.budget.findMany({
                where: {
                    userId,
                    deleted_at: null
                }
            })
            return budgets.map(budget => BudgetEntity.fromObject(budget))
        })
    }
    create(data: CreateBudgetDto, user_audits: string): Promise<string | CustomResponse> {
        return this.handleErrors(async () => {
            const new_budget = await BaseDatasource.prisma.budget.create({
                data
            })
            await this.auditSave(new_budget.id, new_budget, "CREATE", user_audits)
            return "budget created successfully"
        })
    }

}
