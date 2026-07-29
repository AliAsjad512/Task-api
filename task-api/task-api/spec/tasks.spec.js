const request = require('supertest');
const app = require('../src/app');
const { init, reset, pool } = require('../src/db');

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await reset();
});

afterAll(async () => {
    await pool.end();
});

describe('GET /health', () => {
    it('returns ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});

describe('Task CRUD', () => {
    it('creates a task', async () => {
        const res = await request(app).post('/tasks').send({ title: 'Buy milk' });
        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Buy milk');
        expect(res.body.done).toBe(false);
    });

    it('rejects a task with no title', async () => {
        const res = await request(app).post('/tasks').send({});
        expect(res.status).toBe(400);
    });

    it('lists tasks', async () => {
        await request(app).post('/tasks').send({ title: 'Task 1' });
        await request(app).post('/tasks').send({ title: 'Task 2' });
        const res = await request(app).get('/tasks');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('gets a single task', async () => {
        const created = await request(app).post('/tasks').send({ title: 'Find me' });
        const res = await request(app).get(`/tasks/${created.body.id}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Find me');
    });

    it('returns 404 for a missing task', async () => {
        const res = await request(app).get('/tasks/00000000-0000-0000-0000-000000000000');
        expect(res.status).toBe(404);
    });

    it('updates a task', async () => {
        const created = await request(app).post('/tasks').send({ title: 'Old title' });
        const res = await request(app)
            .put(`/tasks/${created.body.id}`)
            .send({ title: 'New title', done: true });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('New title');
        expect(res.body.done).toBe(true);
    });

    it('deletes a task', async () => {
        const created = await request(app).post('/tasks').send({ title: 'Delete me' });
        const del = await request(app).delete(`/tasks/${created.body.id}`);
        expect(del.status).toBe(204);
        const get = await request(app).get(`/tasks/${created.body.id}`);
        expect(get.status).toBe(404);
    });
});
