import { NotificationDatasource } from "../../domain/datasources/notification.datasource";
import { CreateNotificationDto } from "../../domain/dtos/notifications/create-notification.dto";
import { NotificationEntity } from "../../domain/entities/notifications/notification.entity";
import { BaseDatasource } from "../../utils/datasource/base.datasource";
import { CustomResponse } from "../../utils/response/custom.response";

export class NotificationDatasourceImp extends BaseDatasource implements NotificationDatasource {

    constructor() {
        super()
        this.audit_class = "NOTIFICATION"
    }
    create(data: CreateNotificationDto, user_audits: string): Promise<NotificationEntity | CustomResponse> {
        return this.handleErrors(async () => {
            const new_notification = await BaseDatasource.prisma.notification.create({ data })
            await this.auditSave(new_notification.id, new_notification, "CREATE", user_audits)
            return NotificationEntity.fromObject(new_notification);
        })
    }

}