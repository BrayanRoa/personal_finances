import { Response } from "express";

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
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
                case 404:
                    return this.NotFound(res, error.message);
                default:
                    return this.Error(res, error.message);
            }
        } else if (status) {
            switch (status) {
                case 200:
                    return this.Ok(res, error);
                case 201:
                    return this.Created(res, error);
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

    static NoContent(res: Response, data: any): Response {
        return res.status(HttpStatus.NO_CONTENT).json({
            status: HttpStatus.NO_CONTENT,
            statusMsg: "NO CONTENT",
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

    static NotFound(res: Response, data: any): Response {
        return res.status(HttpStatus.NOT_FOUND).json({
            status: HttpStatus.NOT_FOUND,
            statusMsg: "NOT FOUND",
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