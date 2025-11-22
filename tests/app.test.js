// tests/app.test.js
const request = require('supertest');
const app = require('../app');
const db = require('../db');
const fs = require('fs');

const migrationSql = fs.readFileSync('migrations/001_create_links.sql', 'utf8');

beforeAll(async () => {
  // run migration on test DB
  await db.query(migrationSql);
  // clean table
  await db.query('TRUNCATE links');
});

afterAll(async () => {
  await db.pool.end();
});

describe('/healthz', () => {
  test('returns 200 and JSON', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true, version: '1.0' });
  });
});

describe('POST /api/links and duplicate 409', () => {
  test('create link works', async () => {
    const res = await request(app)
      .post('/api/links')
      .send({ target_url: 'https://example.com/test' })
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('code');
    expect(res.body.target_url).toBe('https://example.com/test');
  });

  test('duplicate custom code returns 409', async () => {
    await request(app).post('/api/links').send({ target_url: 'https://a.com', code: 'dupABC1' });
    const res = await request(app).post('/api/links').send({ target_url: 'https://b.com', code: 'dupABC1' });
    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({ error: 'code already exists' });
  });
});

describe('redirect increments clicks atomically', () => {
  test('redirect + increment', async () => {
    // create a link with code 'redir01'
    const create = await request(app).post('/api/links').send({ target_url: 'https://example.org', code: 'redir01' });
    expect(create.statusCode).toBe(201);

    // get stats before
    const statsBefore = await request(app).get('/api/links/redir01');
    expect(statsBefore.statusCode).toBe(200);
    const clicksBefore = statsBefore.body.total_clicks;

    // hit redirect
    const r = await request(app).get('/redir01').redirects(0);
    expect(r.statusCode).toBe(302);
    expect(r.headers.location).toBe('https://example.org');

    // check after
    const statsAfter = await request(app).get('/api/links/redir01');
    expect(statsAfter.statusCode).toBe(200);
    expect(statsAfter.body.total_clicks).toBe(clicksBefore + 1);
    expect(statsAfter.body.last_clicked).not.toBeNull();
  });
});

describe('delete stops redirect', () => {
  test('delete and 404', async () => {
    await request(app).post('/api/links').send({ target_url: 'https://delete.me', code: 'del0011' });
    const del = await request(app).delete('/api/links/del0011');
    expect([200,204]).toContain(del.statusCode);

    const r = await request(app).get('/del0011').redirects(0);
    expect(r.statusCode).toBe(404);
  });
});
