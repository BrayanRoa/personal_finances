import { CustomResponse } from '../../utils/response/custom.response';
import { UpdateTransactionDto } from '../dtos/transaction/update-transaction.dto';
import { TransactionEntity } from '../entities/transaction/transaction.entity';
import { CreateTransactionDto } from './../dtos/transaction/create-transaction.dto';

export abstract class TransactionRepository {

    abstract create(data: CreateTransactionDto, user_audits: string): Promise<string | CustomResponse>

    abstract getAll(userId: string): Promise<TransactionEntity[] | CustomResponse>

    abstract findById(id: number, userId:string): Promise<TransactionEntity | CustomResponse>

    abstract delete(id: number, user_audits: string): Promise<string | CustomResponse>
    abstract update(id: number, data: UpdateTransactionDto, user_audits: string): Promise<string | CustomResponse>


}