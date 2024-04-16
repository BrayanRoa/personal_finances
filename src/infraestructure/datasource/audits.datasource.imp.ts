import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { AuditsDatasource } from "../../domain/datasources/audits-datasource";
import { CreateAuditDTO } from "../../domain/dtos/audits/create-audits.dto";
import { AudistsEntity } from "../../domain/entities/audits/audits.entity";
import { CustomResponse } from "../../utils/response/custom.response";

export class AuditsDatasourceImp extends BaseDatasource implements AuditsDatasource {

    constructor(){
        super()
    }

    create(createAuditDto: CreateAuditDTO): Promise<AudistsEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const new_audit = await BaseDatasource.prisma.audists.create({ data: createAuditDto })
            return AudistsEntity.fromObject(new_audit);
        })
    }

}