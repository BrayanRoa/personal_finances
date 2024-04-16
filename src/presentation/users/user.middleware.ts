import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "../../domain/dtos";
import { validate } from "class-validator";
import { SharedMiddleware } from "../../utils/middleware/base.middleware";
import { UpdateUserDto } from "../../domain/dtos/users/update-user.dto";
import { CustomResponse } from "../../utils/response/custom.response";

export class UserMiddleware extends SharedMiddleware<CreateUserDto, UpdateUserDto> {

    constructor() {
        super(CreateUserDto, UpdateUserDto)
    }

    // async userValidator(req: Request, res: Response, next: NextFunction) {
    //     let data;
    //     if (req.method === "POST") {
    //         data = new CreateUserDto()
    //     } else {
    //         data = new UpdateUserDto()
    //     }
    //     Object.assign(data, req.body)

    //     const errors = await validate(data,
    //         {
    //             whitelist: true, forbidNonWhitelisted: true
    //         })
    //     if (errors.length > 0) {
    //         return CustomResponse.BadRequest(res, this.returnErrors(errors))
    //     }
    //     next()
    // }


}