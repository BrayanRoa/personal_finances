import { Router } from "express"

export class BaseRouter<T, U, D> {

    public readonly router: Router
    public readonly controller: T
    public readonly middleware: U


    constructor(TController: { new(repository: any): T }, UMiddleware: { new(): U }, repository: D) {
        this.router = Router()
        this.controller = new TController(repository)
        this.middleware = new UMiddleware()
        this.routes()
    }

    routes() { }
}