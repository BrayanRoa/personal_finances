import { CreateAuditDTO } from "../../domain/dtos/audits/create-audits.dto";
import { AuditsRepository } from "../../domain/repositories/audits.repository";
import { AuditsDatasourceImp } from "../../infraestructure/datasource/audits.datasource.imp";
import { AuditsRepositoryImpl } from "../../infraestructure/repositories/audits.repository.imp";

export abstract class BaseUseCase {
    // Almacena una única instancia del caso de uso de creación de auditorías
    static auditRepository:AuditsRepository = new AuditsRepositoryImpl(new AuditsDatasourceImp())
    

    protected recordAudit(dto:CreateAuditDTO) {
        // Implementa la lógica que necesites para registrar los eventos de auditoría

        BaseUseCase.auditRepository.create(dto)
    }

    // Define métodos y propiedades adicionales que sean comunes a todos los casos de uso
}