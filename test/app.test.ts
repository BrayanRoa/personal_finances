import { Server } from "./../src/presentation/server"

jest.mock("./../src/presentation/server")
describe("Testing app.ts", () => {
    test("should call server", async () => {
        await import("../src/app")

        expect(Server).toHaveBeenCalledTimes(1) // el server fue llamado una vez
        expect(Server.prototype.listen).toHaveBeenCalledWith() // el server llamo al método listen
    })
})