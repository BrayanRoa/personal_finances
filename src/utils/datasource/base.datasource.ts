import { Prisma, PrismaClient } from "@prisma/client";
import { CustomResponse } from "../response/custom.response";
import { ValidationDb } from "../validations-db/validation-db";
import { CreateAuditDTO } from "../../domain/dtos/audits/create-audits.dto";
import { logger } from "../logger/winston";

type actions = "CREATE" | "DELETE" | "UPDATE"

export class BaseDatasource {
    validationDb: ValidationDb;
    static prisma: PrismaClient = new PrismaClient();
    audit_class!: string

    constructor() {
        this.validationDb = new ValidationDb();
    }

    async handleErrors<T>(operation: () => Promise<T>): Promise<T | CustomResponse> {
        try {
            return await operation();
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                logger.error(error)
                throw this.validationDb.validate(error);
            } else {
                console.log(error);
                throw error;
            }
        }
    }

    protected async auditSave(id: string | number, data: any, type: actions, user_audits: string) {
        const audit: CreateAuditDTO = {
            class_name: this.audit_class,
            data: JSON.stringify(data),
            id_class: id.toString(),
            type,
            user: user_audits
        }
        this.handleErrors(async () => {
            await BaseDatasource.prisma.audists.create({
                data: audit
            })
        })
    }

    calculateMeta(totalRecords: number, perPage: number, currentPage: number) {
        return {
            totalRecords,
            totalPages: Math.ceil(totalRecords / perPage),
            currentPage,
            next_page: totalRecords > currentPage * perPage,
        };
    }
    

}