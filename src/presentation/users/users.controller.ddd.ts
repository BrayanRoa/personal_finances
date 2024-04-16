import { Request, Response } from "express";
import { UserRepository } from "../../domain/repositories/user.repository";
import { CustomResponse } from "../../utils/response/custom.response";
// import { AuditsRepository } from "../../domain/repositories/audits.repository";

export class UserController {
    constructor(
        private readonly userRepository: UserRepository,
        // private readonly auditsRepository: AuditsRepository
    ) { }

    public get = async (req: Request, res: Response) => {
        const { page = 1, per_page = 5 } = req.query;
        try {
            const users = await this.userRepository.getAll(+page, +per_page);
            return CustomResponse.handleResponse(res, users, 200);
        } catch (error) {
            return CustomResponse.handleResponse(res, error);
        }
    }

    public getOne = async (req: Request, res: Response) => {
        const id = req.params.id
        try {
            const user = await this.userRepository.findById(id)
            return CustomResponse.handleResponse(res, user, 200);
        } catch (error) {
            return CustomResponse.handleResponse(res, error)
        }
    }

    public create = async (req: Request, res: Response) => {
        try {
            const new_user = await this.userRepository.create(req.body)
            return CustomResponse.handleResponse(res, new_user, 201);
        } catch (error) {
            return CustomResponse.handleResponse(res, error)
        }

    }

    public update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const userUpdated = await this.userRepository.update(id, req.body)
            return CustomResponse.handleResponse(res, userUpdated, 200)
        } catch (error) {
            return CustomResponse.handleResponse(res, error)
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const user_delete = await this.userRepository.delete(id);
            return CustomResponse.handleResponse(res, user_delete, 200)
        } catch (error) {
            return CustomResponse.handleResponse(res, error)
        }
    }
}