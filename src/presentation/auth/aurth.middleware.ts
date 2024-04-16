import { CreateUserDto } from "../../domain/dtos";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { SharedMiddleware } from "../../utils/middleware/base.middleware";

export class AuthMiddleware extends SharedMiddleware<CreateUserDto, LoginUserDto> {
    constructor() {
        super(CreateUserDto, LoginUserDto);
    }
}