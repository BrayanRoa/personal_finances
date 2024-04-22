// import { prisma } from "../../database/postgres";
import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { CreateUserDto } from "../../domain/dtos";
import { UpdateUserDto } from "../../domain/dtos/users/update-user.dto";
import { UserEntity } from "../../domain/entities/users/user.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";


export class AuthDatasourceImp extends BaseDatasource implements AuthDatasource {
    constructor() {
        super()
    }
    findOneUser(param: string, type?: string): Promise<UserEntity | CustomResponse> {
        let condition = (type === "LOGIN")
            ? { deleted_at: null, emailValidated: true }
            : { deleted_at: null }

        return this.handleErrors(async () => {
            const exist = await BaseDatasource.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: param },
                        { id: param }
                    ],
                    AND: [
                        { ...condition },
                    ]
                }
            })
            if (exist) {
                return UserEntity.fromObject(exist)
            } else {
                return new CustomResponse("email not found", 404)
            }
        })
    }
    registerUser(createUserDto: CreateUserDto): Promise<UserEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const new_user = await BaseDatasource.prisma.user.create({
                data: createUserDto,
            });
            return UserEntity.fromObject(new_user);
        });
    }

    updateUSer(id: string, data: UpdateUserDto): Promise<boolean | CustomResponse> {
        return this.handleErrors(async () => {
            await BaseDatasource.prisma.user.update({
                where: {
                    id
                },
                data: data
            });
            return true;
        })
    }
}
