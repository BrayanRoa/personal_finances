import request from 'supertest';
import { testServer } from '../../test-server';
import { ConfigDatabase } from '../../../src/database/postgres';


describe("user route testing", async () => {
    const prisma = await ConfigDatabase.prisma()
    const prefix = '/api/v1/users';


    beforeAll(async () => {
        await prisma!.user.deleteMany(); // BORRO TODO LO QUE HAYA EN LA TABLA PORQUE SINO SE ESTARAN AGRERANDO DOS REGISTROS CADA VEZ QUE GUARDE CAMBIOS
    })

    beforeEach(async () => {
        await prisma!.user.deleteMany(); // BORRO TODO LO QUE HAYA EN LA TABLA PORQUE SINO SE ESTARAN AGRERANDO DOS REGISTROS CADA VEZ QUE GUARDE CAMBIOS
    })

    afterAll(() => {
        testServer.close(); // ESTO ES IMPORTANTE PORQUE SINO VERE UN WARNING EN LA CONSOLA CUANDO EJECUTE LOS TEST QUE DICE QUE EL SERVER NO SE CERRO NUNCA Y COMO ESTOY EN TESTING, DESPUES DE LAS PRUEBAS EL DEBERIA CERRARSE
    })

    const user1 = { name: "anny", email: "anny@example.com", password: "569641" }
    const user2 = { name: "jhon", email: "jhon@example.com", password: "569641" }

    test(`should return all users (get all) - ${prefix}`, async () => {

        testServer.listen()
        await prisma.user.createMany({
            data: [user1, user2]
        });

        const { body } = await request(testServer.app)
            .get(`${prefix}`)
            .expect(200);

        expect(body?.data).toBeInstanceOf(Array)
        expect(body?.data.length).toBe(2)
        expect(body.statusMsg).toBe("SUCCESS")
    })

    test(`should return one user (get one) - ${prefix}/:id`, async () => {

        const user = await prisma.user.create({ data: { name: "noemi", email: "noemi@example.com", password: "569641" } })

        const { body } = await request(testServer.app)
            .get(`${prefix}/${user.id}`)
            .expect(200);

        expect(body?.data).toBeInstanceOf(Object)
        expect(body).toEqual({
            status: 200,
            statusMsg: "SUCCESS",
            data: {
                ...user,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null
            }
        })
    })

    test(`should return 404 code when user does not exist (get one) - ${prefix}/:id`, async () => {
        const id = 999
        const { body } = await request(testServer.app)
            .get(`${prefix}/${id}`)
            .expect(404);

        expect(body).toEqual({
            status: 404,
            statusMsg: "NOT FOUND",
            data: `User with id ${id} not found`
        })
    })

    test(`should return code 201 if the user was created successfully (create) - ${prefix}`, async () => {
        const { body } = await request(testServer.app)
            .post(`${prefix}`)
            .send(user1)
            .expect(201);

        expect(body).toEqual({
            status: 201,
            statusMsg: "CREATED",
            data: {
                id: expect.any(Number),
                name: user1.name,
                email: user1.email,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null
            }
        })
    })

    test(`should return code 404 if the email of the user already exist en database (create) - ${prefix}`, async () => {

        await request(testServer.app)
            .post(`${prefix}`)
            .send(user1)
            .expect(201);

        const { body } = await request(testServer.app)
            .post(`${prefix}`)
            .send(user1)
            .expect(400);

        expect(body).toEqual({
            status: 400,
            statusMsg: "BAD REQUEST",
            data: `the email already exists in the database`
        })
    })

    test(`should return code 404 if the email and the name are not send in the request (create) - ${prefix}`, async () => {

        const { body } = await request(testServer.app)
            .post(`${prefix}`)
            .send({ name: "", email: "" })
            .expect(400);


        expect(body).toEqual({
            status: 400,
            statusMsg: "BAD REQUEST",
            data: expect.any(Object)
        })

        expect(body.data).toBeInstanceOf(Object)
        expect(body.data.length).toBe(2)

    })

    test(`should return code 200 if the record is updated successfully (update) - ${prefix}/id`, async () => {

        const user = await prisma.user.create({ data: user1 })

        const { body } = await request(testServer.app)
            .put(`${prefix}/${user.id}`)
            .send({ email: "anny@gmail.com" })
            .expect(200);

        expect(body).toEqual({
            status: 200,
            statusMsg: "SUCCESS",
            data: {
                id: user.id,
                name: user.name,
                email: "anny@gmail.com",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null
            }
        })
    })

    test(`should return 404 if the user was not found (update) - ${prefix}/id`, async () => {
        const { body } = await request(testServer.app)
            .put(`${prefix}/999`)
            .send({ email: "anny@gmail.com" })
            .expect(404);

        expect(body).toEqual({
            status: 404,
            statusMsg: "NOT FOUND",
            data: `Record to update not found.`
        })
    })

    test("should return code 200 if the user was deleted", async () => {
        const user = await prisma.user.create({ data: user1 })

        const { body } = await request(testServer.app)
            .delete(`${prefix}/${user.id}`)
            .expect(200);

        expect(body).toEqual({
            status: 200,
            statusMsg: "SUCCESS",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: expect.any(String)
            }
        })
    })
})