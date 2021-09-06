require('dotenv').config()

const request = require('supertest');
const app = require('../server');
const { Task } = require('../models');
const jwt = require('jsonwebtoken');
const { array } = require('@hapi/joi');

const routes = {
    task: '/v1/task',
}

// insert access token first
let accessToken;
let taskId;

describe(`POST ${routes.task}`, () => {
    beforeAll(async () => {
        const data = {
            username: 'test',
            level: 'level',
        };
    
        const payload = {
            data
        }

        accessToken = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: '15m' })
    })

    test('it should return bad request when required field are not filled or empty', async () => {
        const response = await request(app)
        .post(routes.task)
        .set('X-Auth-Token', accessToken)
        .send({
            task: ''
        })
     
        expect(response.statusCode || response.body.code).toBe(400);
        expect(response.body.status).toBe('ERROR')
        expect(response.body.message).toMatch(/required|empty/)
        expect(response.body.data).toBe(null);
    })

    test('it should return success when task inserted', async () => {
        const response = await request(app)
        .post(routes.task)
        .set('X-Auth-Token', accessToken)
        .send({
            task: 'test task'
        })
     
        expect(response.statusCode || response.body.code).toBe(201);
        expect(response.body.status).toBe('SUCCESS')
        expect(response.body.message).toMatch('CREATED')
        expect(response.body.data.task).toBe('test task');

        taskId = response.body.data.id
    })
})

describe(`GET ${routes.task}`, () => {
    beforeAll(async () => {
        const data = {
            username: 'test',
            level: 'level',
        };
    
        const payload = {
            data
        }

        accessToken = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: '15m' })
    })

    test('it should return array of tasks', async () => {
        const response = await request(app)
        .get(routes.task)
        .set('X-Auth-Token', accessToken)
     
        expect(response.statusCode || response.body.code).toBe(200);
        expect(response.body.status).toBe('SUCCESS')
        expect(response.body.message).toMatch('OK')
        expect(response.body.data).toEqual(expect.arrayContaining([
            expect.objectContaining({ task: 'test task' }),
        ]));
    })
})

describe(`GET ${routes.task}/:id`, () => {
    beforeAll(async () => {
        const data = {
            username: 'test',
            level: 'level',
        };
    
        const payload = {
            data
        }

        accessToken = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: '15m' })
    })

    test('it should return task', async () => {
        const response = await request(app)
        .get(routes.task+'/'+taskId)
        .set('X-Auth-Token', accessToken)
     
        expect(response.statusCode || response.body.code).toBe(200);
        expect(response.body.status).toBe('SUCCESS')
        expect(response.body.message).toMatch('OK')
        expect(response.body.data).toEqual(expect.objectContaining({ 
            id: taskId,
            task: 'test task' 
        }));
    })

    afterAll(async () => {
        await Task.destroy({
            where: { task: 'test task' }
        })
    })
})