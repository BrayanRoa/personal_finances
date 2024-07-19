import { NotificationDatasource } from "../../domain/datasources/notification.datasource";
import { CreateNotificationDto } from "../../domain/dtos/notifications/create-notification.dto";
import { NotificationEntity } from "../../domain/entities/notifications/notification.entity";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { CustomResponse } from "../../utils/response/custom.response";

export class NotificationRepositoryImp implements NotificationRepository {

    constructor(
        private readonly notificationDatasource: NotificationDatasource
    ) { }
    create(data: CreateNotificationDto, user_audits: string): Promise<NotificationEntity | CustomResponse> {
        return this.notificationDatasource.create(data, user_audits);
    }

}