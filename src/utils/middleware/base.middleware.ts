import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { CustomResponse } from "../response/custom.response";
import { JwtAdapter } from "../jwt/jwt";
import { BaseDatasource } from "../datasource/base.datasource";

export class SharedMiddleware<
    T extends {} | null = null,
    U extends {} | null = null
> {
    constructor(
        private TCreateDto?: { new(): T } | null,
        private UUpdateDto?: { new(): U } | null
    ) { }

    public returnErrors(error: ValidationError[]) {
        return error.map((error) => {
            return {
                property: error.property,
                constraints: error.constraints,
            };
        });
    }

    public async validateDto(
        req: Request,
        res: Response,
        next: NextFunction,
        type: "create" | "update"
    ) {
        let data: T | U;
        const { id_user, ...rest } = req.body;

        if (type === "create") {
            if (!this.TCreateDto) {
                return CustomResponse.BadRequest(res, "Create DTO is not defined");
            }
            data = Object.assign(new this.TCreateDto()!, rest);
        } else {
            if (!this.UUpdateDto) {
                return CustomResponse.BadRequest(res, "Update DTO is not defined");
            }
            data = Object.assign(new this.UUpdateDto()!, rest);
        }

        const errors = await validate(data!, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            return CustomResponse.BadRequest(res, this.returnErrors(errors));
        }
        next();
    }

    public async validarJwt(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header("Authorization");
        if (!authorization)
            return CustomResponse.Unauthorized(res, `There is no token on the request`);

        if (!authorization.startsWith("Bearer "))
            return CustomResponse.Unauthorized(res, `Invalid Bearer token`);

        const token = authorization.split(" ")[1] || "";

        try {
            const payload = await JwtAdapter.decodeToken<{ id: string }>(token);
            if (!payload)
                return CustomResponse.Unauthorized(
                    res,
                    `Token invalid - Contact the administrator`
                );

            const user = await BaseDatasource.prisma.user.findFirst({
                where: {
                    id: payload.id,
                },
            });
            if (!user)
                return CustomResponse.Unauthorized(
                    res,
                    `Token invalid - Contact the administrator`
                );

            req.body.userId = user.id;
            next();
        } catch (error: any) {
            CustomResponse.Unauthorized(res, error);
        }
    }
}
