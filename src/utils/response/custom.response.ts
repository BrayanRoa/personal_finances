import { Response } from "express";

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    DELETED = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAR_SERVER_ERROR = 500
}

export class CustomResponse extends Error {

    constructor(
        public readonly message: string,
        public readonly statusCode: number = 400
    ) {
        super(message);
    }

    static handleResponse(res: Response, error: unknown, status?: number) {

        if (error instanceof CustomResponse) {
            switch (error.statusCode) {
                case 400:
                    return this.BadRequest(res, error.message);
                case 401:
                    return this.Unauthorized(res, error.message);
                case 403:
                    return this.Forbidden(res, error.message);
                case 404:
                    return this.NotFound(res, error.message);
                case 409:
                    return this.Conflict(res, error.message);
                default:
                    return this.Error(res, error.message);
            }
        } else if (status) {
            switch (status) {
                case 200:
                    return this.Ok(res, error);
                case 201:
                    return this.Created(res, error);
                case 204:
                    return this.Deleted(res, error);
                default:
                    return this.Error(res, error);
            }
        }

        return this.Error(res, error)

    }

    static Ok(res: Response, data: any): Response {
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            statusMsg: "SUCCESS",
            data
        })
    }

    static Created(res: Response, data: any): Response {
        return res.status(HttpStatus.CREATED).json({
            status: HttpStatus.CREATED,
            statusMsg: "CREATED",
            data
        })
    }

    static Deleted(res: Response, data: any): Response {
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            statusMsg: "DELETED",
            data
        })
    }

    static BadRequest(res: Response, data: any): Response {
        return res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            statusMsg: "BAD REQUEST",
            data
        })
    }

    static Unauthorized(res: Response, data: any): Response {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            status: HttpStatus.UNAUTHORIZED,
            statusMsg: "UNAUTHORIZED",
            data
        })
    }

    static Forbidden(res: Response, data: any): Response {
        return res.status(HttpStatus.FORBIDDEN).json({
            status: HttpStatus.FORBIDDEN,
            statusMsg: "FORBIDDEN",
            data
        })
    }

    static NotFound(res: Response, data: any): Response {
        return res.status(HttpStatus.NOT_FOUND).json({
            status: HttpStatus.NOT_FOUND,
            statusMsg: "NOT FOUND",
            data
        })
    }

    static Conflict(res: Response, data: any): Response {
        return res.status(HttpStatus.CONFLICT).json({
            status: HttpStatus.CONFLICT,
            statusMsg: "CONFLICT",
            data
        })
    }

    static Error(res: Response, data: any): Response {
        return res.status(HttpStatus.INTERNAR_SERVER_ERROR).json({
            status: HttpStatus.INTERNAR_SERVER_ERROR,
            statusMsg: "INTERNAL_SERVER_ERROR",
            data: data
        })
    }

    static Custom(res: Response, data: any) {
        if (data.code === "23505") {
            this.BadRequest(res, data.detail)
        }
        else {
            this.BadRequest(res, data.message)
        }
    }

}