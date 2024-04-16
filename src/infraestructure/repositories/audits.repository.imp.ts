import { AuditsDatasource } from "../../domain/datasources/audits-datasource";
import { CreateAuditDTO } from "../../domain/dtos/audits/create-audits.dto";
import { AudistsEntity } from "../../domain/entities/audits/audits.entity";
import { AuditsRepository } from "../../domain/repositories/audits.repository";
import { CustomResponse } from "../../utils/response/custom.response";

export class AuditsRepositoryImpl implements AuditsRepository {

    constructor(
        private readonly dataSource: AuditsDatasource
    ) { }
    create(createAuditDto: CreateAuditDTO): Promise<AudistsEntity | CustomResponse> {
        return this.dataSource.create(createAuditDto)
    }

}