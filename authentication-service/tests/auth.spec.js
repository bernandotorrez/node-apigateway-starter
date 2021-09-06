const request = require('supertest');
const app = require('../server');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const routes = {
    register: '/v1/auth/register',
    login: '/v1/auth/login'
}

describe(`GET ${routes.register}`, () => {
    test('it should return bad request when required field are not filled', async () => {
        const response = await request(app)
        .post(routes.register)
        .send({
            username: 'test'
        })
     
        expect(response.statusCode || response.body.code).toBe(400);
        expect(response.body.status).toBe('ERROR')
        expect(response.body.message).toContain('required')
        expect(response.body.data).toBe(null);
    })

    test('it should return success when successfully registered', async () => {
        const response = await request(app)
        .post(routes.register)
        .send({
            username: 'test',
            password: 'test'
        })

        expect(response.statusCode || response.body.code).toBe(200)
        expect(response.body.status).toBe('SUCCESS')
        expect(response.body.message).toBe('OK')
        expect(response.body.data.username).toBe('test')
    })

    test('it should return Username already exist when user exist', async () => {
        const response = await request(app)
        .post(routes.register)
        .send({
            username: 'test',
            password: 'test'
        })

        expect(response.statusCode || response.body.code).toBe(200)
        expect(response.body.status).toBe('ERROR')
        expect(response.body.message).toBe('Username already Exist')
        expect(response.body.data).toBe(null)
    })

    afterAll(async () => {
        await User.destroy({
            where: {
                username: 'test'
            }
        })
    })
})

describe(`GET ${routes.login}`, () => {
    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash('test', 10);
        await User.create({
            username: 'test',
            password: hashedPassword,
            level: 'user'
        })
    })

    test('it should return bad request when required field are not filled', async () => {
        const response = await request(app)
        .post(routes.login)
        .send({
            username: 'test'
        })

        expect(response.statusCode || response.body.code).toBe(400);
        expect(response.body.status).toBe('ERROR')
        expect(response.body.message).toContain('required')
        expect(response.body.data).toBe(null);
    })

    test('it should return login failed when username or password is wrong', async () => {
        const response = await request(app)
        .post(routes.login)
        .send({
            username: 'test',
            password: 'asdsadsad'
        })

        expect(response.statusCode || response.body.code).toBe(200);
        expect(response.body.status).toBe('ERROR')
        expect(response.body.message).toBe('Username or Password is Incorrect')
        expect(response.body.data).toBe(null);
    })

    test('it should return success when username and password is correct', async () => {
        const response = await request(app)
        .post(routes.login)
        .send({
            username: 'test',
            password: 'test'
        })

        expect(response.statusCode || response.body.code).toBe(200);
        expect(response.body.status).toBe('SUCCESS')
        expect(response.body.message).toBe('OK')
        expect(response.body.data).toBe('test')
        expect(response.headers).toHaveProperty('x-auth-token')
        expect(response.headers).toHaveProperty('x-auth-refresh-token')
    })

    afterAll(async () => {
        await User.destroy({
            where: {
                username: 'test'
            }
        })
    })
})