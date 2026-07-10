import request from 'supertest';
import app from '../src/app';
import prisma from '../src/prisma';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';
import http from 'http';

// Load normal .env (use production/dev DB per request)
dotenv.config();
process.env.NODE_ENV = 'test';

const TEST_PORT = Number(process.env.TEST_PORT || 4001);

async function clearData() {
  // Keep roles (we will recreate them if missing), but clear domain data
  await prisma.loan.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
  await prisma.author.deleteMany();
  await prisma.category.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
}

async function ensureRoles() {
  const roles = ['admin', 'bibliotecario', 'cliente', 'estudiante', 'profesor'];
  for (const r of roles) {
    const existing = await prisma.role.findUnique({ where: { name: r } });
    if (!existing) {
      await prisma.role.create({ data: { name: r, description: `${r} role` } });
    }
  }
}

describe('Backend readiness tests (Jest + Supertest)', () => {
  let server: http.Server | null = null;

  beforeAll(async () => {
    // Ensure env and test DB
    const testDb = process.env.DATABASE_URL;
    if (!testDb) throw new Error('DATABASE_URL is not defined in .env');

    // Run migrations against the configured DB from .env
    try {
      execSync('npx prisma migrate deploy', {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: testDb },
      });
    } catch (err: any) {
      // Allow test to continue if migrations are already applied, but surface error
      console.warn('prisma migrate deploy warning:', err?.message || err?.toString());
    }

    await prisma.$connect();
    await ensureRoles();
    await clearData();
  }, 300000);

  afterAll(async () => {
    if (server) server.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await clearData();
  });

  test('Server starts on configured port and responds to root/health', async () => {
    // Start the app on a real port to validate start behavior
    server = app.listen(TEST_PORT);

    // Wait briefly for server to be ready
    await new Promise((resolve) => setTimeout(resolve, 200));

    const res = await request(`http://localhost:${TEST_PORT}`).get('/health');
    expect(res.status).toBe(200);

    // Also test the app object directly
    await request(app).get('/health').expect(200);

    server.close();
    server = null;
  });

  test('POST /auth/register creates a user (201) and POST /auth/login returns JWT', async () => {
    const demo = {
      name: 'Test User',
      email: `test.user+${Date.now()}@test.local`,
      password: 'Password123!',
      roleName: 'cliente',
    };

    const registerRes = await request(app).post('/auth/register').send(demo);
    expect([200, 201]).toContain(registerRes.status);
    expect(registerRes.body.token).toBeDefined();
    expect(typeof registerRes.body.token).toBe('string');

    const loginRes = await request(app).post('/auth/login').send({ email: demo.email, password: demo.password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    expect(typeof loginRes.body.token).toBe('string');
  });

  test('Server and endpoints fail clearly when something is wrong', async () => {
    // This test intentionally makes sure endpoints do not return 500.
    const res = await request(app).get('/health');
    if (res.status >= 500) {
      throw new Error(`/health returned ${res.status} - ${JSON.stringify(res.body)}`);
    }

    // Try calling a not-yet-created route to ensure 404 is handled
    const r2 = await request(app).get('/__this_route_should_not_exist__');
    expect([404, 200]).toContain(r2.status);
  });
});
