import { CustomResponse } from "../../../utils/response/custom.response";
import { IconEntity } from "../../entities/category/icon.entity";
import { CategoryRepository } from "../../repositories/category.repository";

export interface GetAllIconsUseCase {
    execute(): Promise<IconEntity[] | CustomResponse>;
}


export class GetAllIcons implements GetAllIconsUseCase {

    constructor(
        private readonly repository: CategoryRepository
    ) { }
    async execute(): Promise<CustomResponse | IconEntity[]> {
        return this.repository.getIcons()
    }

}