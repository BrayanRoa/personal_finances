import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { CustomResponse } from "../response/custom.response";
import { JwtAdapter } from "../jwt/jwt";
import { BaseDatasource } from "../datasource/base.datasource";

import * as admin from 'firebase-admin';
import { envs } from "../../config/envs";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: envs.FIREBASE_PROJECT_ID,
            privateKey: envs.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
            clientEmail: envs.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

export class SharedMiddleware<
    T extends {} | null = null,
    U extends {} | null = null,
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
        console.log({ authorization });

        if (!authorization)
            return CustomResponse.Unauthorized(res, `There is no token on the request`);

        if (!authorization.startsWith("Bearer "))
            return CustomResponse.Unauthorized(res, `Invalid Bearer token`);

        const token = authorization.split(" ")[1] || "";

        try {
            // Primero intenta decodificar tu propio token
            const payload = await JwtAdapter.decodeToken<{ id: string }>(token);

            if (payload) {
                // Si el payload de tu JWT es válido, busca el usuario
                const user = await BaseDatasource.prisma.user.findFirst({
                    where: { id: payload.id }
                });

                if (!user)
                    return CustomResponse.Unauthorized(res, `Token invalid - Contact the administrator`);

                req.body.userId = user.id;
                return next(); // Continúa con la petición
            } else {
                // Si no se pudo decodificar el token, intenta con Firebase
                const decodedToken: any = await admin.auth().verifyIdToken(token);
                console.log({ decodedToken });

                if (!decodedToken)
                    return CustomResponse.Unauthorized(res, `Token invalid - Contact the administrator`);

                // Busca el usuario en tu base de datos por el email de Firebase
                const user = await BaseDatasource.prisma.user.findFirst({
                    where: { email: decodedToken.email }
                });

                if (!user)
                    return CustomResponse.Unauthorized(res, `Token invalid - Contact the administrator`);

                req.body.userId = user.id;
                return next(); // Continúa con la petición
            }

        } catch (error: any) {
            return CustomResponse.Unauthorized(res, error);
        }
    }

    async buildLoginDataFirebase(req: Request, res: Response, next: NextFunction) {
        const { token } = req.params
        const decodedToken: any = await admin.auth().verifyIdToken(token);

        if (!decodedToken) return CustomResponse.Unauthorized(res, 'Invalid token')

        // req.body.userId = data.uid
        console.log(decodedToken)

        req.body = {
            name: decodedToken.name,
            email: decodedToken.email,
            authProvider: decodedToken.firebase.sign_in_provider,
            emailValidated: true,
            email_sent: true
        }
        next();
    }

}
