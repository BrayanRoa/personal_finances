import { UserDatasource } from "../../domain/datasources/user.datasource";
import { CreateUserDto } from "../../domain/dtos";
import { UpdateUserDto } from "../../domain/dtos/users/update-user.dto";
import { UserEntity } from "../../domain/entities/users/user.entity";
import { CustomResponse } from "../../utils/response/custom.response";
import { BaseDatasource } from "../../utils/datasource/base.datasource";

// * SI CAMBIARA A MONGOOSE O a TYPEORM AQUI ES DONDE DEBO MODIFICAR TODO
export class UserDatasourceImp extends BaseDatasource implements UserDatasource {

    constructor(
    ) {
        super()
        this.audit_class = "USER"
    }

    create(createUserDto: CreateUserDto, user_audits: string): Promise<UserEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const new_user = await BaseDatasource.prisma.user.create({
                data: createUserDto,
            });
            const { password, ...rest } = UserEntity.fromObject(new_user);
            this.auditSave(rest, "CREATE", user_audits)
            return { ...rest };
        });
    }
    getAll(page: number, per_page: number): Promise<UserEntity[] | CustomResponse> {
        return this.handleErrors(async () => {
            const users = await BaseDatasource.prisma.user.findMany({
                where: {
                    AND:
                        [
                            { email_sent: true },
                            { emailValidated: true },
                            { deleted_at: null }
                        ]
                }
            })
            if (users.length === 0) throw new CustomResponse("there are no users", 404)
            const usersWithoutPassword = users.map(user => {
                const { password, ...rest } = UserEntity.fromObject(user);
                return { ...rest };
            });

            return usersWithoutPassword;
        })
    }
    findById(id: string): Promise<UserEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const user = await BaseDatasource.prisma.user.findFirst({
                where: {
                    AND:
                        [
                            { id, deleted_at: null },
                            { emailValidated: true }
                        ]
                }
            });
            if (!user) throw new CustomResponse(`User with id ${id} not found`, 404);
            const { password, ...rest } = UserEntity.fromObject(user);
            return { ...rest }
        })
    }
    update(id: string, updateUserDto: UpdateUserDto, user_audits: string): Promise<UserEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const updated = await BaseDatasource.prisma.user.update({
                where: { id },
                data: updateUserDto
            })
            this.auditSave(updated, "UPDATE", user_audits)
            return UserEntity.fromObject(updated);
        })
    }
    delete(id: string, user_audits: string): Promise<UserEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const deleted = await BaseDatasource.prisma.user.update({
                where: { id },
                data: { deleted_at: new Date() }
            })
            this.auditSave(deleted, "DELETE", user_audits)
            return UserEntity.fromObject(deleted);
        });
    }

}