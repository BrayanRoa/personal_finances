import { Server } from "./presentation/server"
// import { AppRoutes } from "./presentation/routes";

(async () => {
    main()
})()

function main() {
    const server = new Server()
    server.listen()
}