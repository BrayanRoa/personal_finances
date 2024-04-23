import { CustomResponse } from "../../utils/response/custom.response";
import { CreateAuditDTO } from "../dtos/audits/create-audits.dto";
import { AudistsEntity } from "../entities/audits/audits.entity";

export abstract class AuditsRepository {
    abstract create(data: CreateAuditDTO): Promise<AudistsEntity | CustomResponse>
}