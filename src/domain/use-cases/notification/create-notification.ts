import { CustomResponse } from "../../../utils/response/custom.response";
import { CreateNotificationDto } from "../../dtos/notifications/create-notification.dto";
import { NotificationEntity } from "../../entities/notifications/notification.entity";
import { NotificationRepository } from "../../repositories/notification.repository";

export interface CreateNotificationUseCase {
    execute(dto: CreateNotificationDto): Promise<NotificationEntity | string | CustomResponse>;
}

export class CreateNotification implements CreateNotificationUseCase {

    constructor(
        public notificationRepository: NotificationRepository
    ) { }
    execute(dto: CreateNotificationDto): Promise<NotificationEntity | string | CustomResponse> {
        return this.notificationRepository.create(dto, dto.userId)
    }

}