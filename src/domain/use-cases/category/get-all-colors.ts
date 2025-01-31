import { CustomResponse } from "../../../utils/response/custom.response";
import { ColorEntity } from "../../entities/category/color.entity";
import { IconEntity } from "../../entities/category/icon.entity";
import { CategoryRepository } from "../../repositories/category.repository";

export interface GetAllColorsUseCase {
    execute(): Promise<ColorEntity[] | CustomResponse>;
}


export class GetAllColors implements GetAllColorsUseCase {

    constructor(
        private readonly repository: CategoryRepository
    ) { }
    async execute(): Promise<CustomResponse | ColorEntity[]> {
        return this.repository.getColors()
    }

}