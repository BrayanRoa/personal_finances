import { CreateTransactionDto } from "../../domain/dtos/transaction/create-transaction.dto";
import { UpdateTransactionDto } from "../../domain/dtos/transaction/update-transaction.dto";
import { SharedMiddleware } from "../../utils/middleware/base.middleware";

export class TransactionMiddleware extends SharedMiddleware<CreateTransactionDto, UpdateTransactionDto> {

    constructor() {
        super(CreateTransactionDto, UpdateTransactionDto);
    }
}