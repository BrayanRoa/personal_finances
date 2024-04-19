import { Prisma } from "@prisma/client";
import { CustomResponse } from "../response/custom.response";

export interface PrismaErrors {
    name: string;
    code: string;
    clientVersion: string;
    meta: Meta;
}

export interface Meta {
    [key: string]: unknown;
}


export class ValidationDb {

    validate(error: any): CustomResponse | undefined {
        const errors = error as PrismaErrors;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Puedes añadir más detalles al error si lo necesitas.
            switch (errors.code) {
                case 'P2002':
                    return new CustomResponse(`the ${errors.meta.target} already exists in the database`, 400);
                case 'P2021':
                    return new CustomResponse(`table name: '${errors.meta.modelName}' dont exist in database`, 400);
                case 'P2025':
                    return new CustomResponse(`${errors.meta.cause}`, 404);
                case 'P2003':
                    return new CustomResponse(`Foreign key constraint failed on field: '${errors.meta.field_name}' in model: '${errors.meta.modelName}'`, 400)
                default:
                    return new CustomResponse(`review this code error ${errors.code}`, 400)
            }
        }
        return error
    }
}