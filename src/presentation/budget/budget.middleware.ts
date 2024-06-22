import { CreateBudgetDto } from "../../domain/dtos/budget/create-budget.dto";
import { UpdateBudgetDto } from "../../domain/dtos/budget/update-budget.dto";
import { SharedMiddleware } from "../../utils/middleware/base.middleware";

export class BudgetMiddleware extends SharedMiddleware<CreateBudgetDto, UpdateBudgetDto> {
    constructor() {
        super(CreateBudgetDto, UpdateBudgetDto)
    }
}