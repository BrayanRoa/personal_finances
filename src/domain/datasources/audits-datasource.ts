import { CustomResponse } from "../../utils/response/custom.response";
import { CreateAuditDTO } from "../dtos/audits/create-audits.dto";
import { AudistsEntity } from '../entities';
export abstract class AuditsDatasource {

    abstract create(data: CreateAuditDTO): Promise<AudistsEntity | CustomResponse>
}