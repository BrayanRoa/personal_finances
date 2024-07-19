import { CustomResponse } from "../../utils/response/custom.response";
import { CreateNotificationDto } from "../dtos/notifications/create-notification.dto";
import { NotificationEntity } from "../entities/notifications/notification.entity";

export abstract class NotificationRepository {
    abstract create(data: CreateNotificationDto, user_audits: string): Promise<NotificationEntity | CustomResponse>
}