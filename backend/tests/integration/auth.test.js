/**
 * Auth Integration Tests
 * 
 * Tests for authentication endpoints (register, login)
 */

const request = require('supertest');
const express = require('express');
const {
  setupTestDatabase,
  syncDatabase,
  clearDatabase,
  closeDatabase,
  generateEmail
} = require('../utils/testHelper');
const authRoutes = require('../../src/routes/authRoutes');
const { User } = require('../../src/database/models');

// Create test app
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await setupTestDatabase();
    await syncDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: generateEmail('john'),
        password: 'password123',
        role: 'researcher'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.role).toBe(userData.role);
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    test('should default role to researcher if not provided', async () => {
      const userData = {
        name: 'Jane Doe',
        email: generateEmail('jane'),
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.role).toBe('researcher');
    });

    test('should accept nonprofit role', async () => {
      const userData = {
        name: 'Charity Org',
        email: generateEmail('charity'),
        password: 'password123',
        role: 'nonprofit'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.role).toBe('nonprofit');
    });

    test('should normalize email to lowercase', async () => {
      const userData = {
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.email).toBe('test@example.com');
    });

    test('should return 400 if name is missing', async () => {
      const userData = {
        email: generateEmail(),
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('name');
    });

    test('should return 400 if email is missing', async () => {
      const userData = {
        name: 'Test User',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email');
    });

    test('should return 400 if password is missing', async () => {
      const userData = {
        name: 'Test User',
        email: generateEmail()
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('password');
    });

    test('should return 409 if email already exists', async () => {
      const email = generateEmail('duplicate');
      
      // First registration
      await request(app)
        .post('/auth/register')
        .send({
          name: 'User 1',
          email: email,
          password: 'password123'
        })
        .expect(201);

      // Duplicate registration
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'User 2',
          email: email,
          password: 'password456'
        })
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email');
    });

    test('should hash password before storing', async () => {
      const userData = {
        name: 'Test User',
        email: generateEmail(),
        password: 'password123'
      };

      await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      const user = await User.findOne({ where: { email: userData.email } });

      expect(user.password_hash).toBeDefined();
      expect(user.password_hash).not.toBe(userData.password);
      expect(user.password_hash.length).toBeGreaterThan(50); // bcrypt hashes are ~60 chars
    });

    test('should return valid JWT token', async () => {
      const userData = {
        name: 'Test User',
        email: generateEmail(),
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.split('.')).toHaveLength(3); // JWT format: header.payload.signature
    });
  });

  describe('POST /auth/login', () => {
    const testUser = {
      name: 'Test User',
      email: 'login@example.com',
      password: 'password123',
      role: 'researcher'
    };

    beforeEach(async () => {
      // Create a user to login with
      await request(app)
        .post('/auth/register')
        .send(testUser);
    });

    test('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    test('should be case-insensitive for email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email.toUpperCase(),
          password: testUser.password
        })
        .expect(200);

      expect(response.body.user.email).toBe(testUser.email);
    });

    test('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          password: testUser.password
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email');
    });

    test('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('password');
    });

    test('should return 401 for non-existent email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email');
    });

    test('should return 401 for incorrect password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('password');
    });

    test('should return valid JWT token on login', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.split('.')).toHaveLength(3);
    });

    test('should include user role in response', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body.user.role).toBe(testUser.role);
    });

    test('should not expose password_hash in response', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body.user).not.toHaveProperty('password_hash');
    });
  });

  describe('Password Security', () => {
    test('should hash different passwords differently', async () => {
      const email1 = generateEmail('user1');
      const email2 = generateEmail('user2');

      await request(app)
        .post('/auth/register')
        .send({
          name: 'User 1',
          email: email1,
          password: 'password123'
        });

      await request(app)
        .post('/auth/register')
        .send({
          name: 'User 2',
          email: email2,
          password: 'password456'
        });

      const user1 = await User.findOne({ where: { email: email1 } });
      const user2 = await User.findOne({ where: { email: email2 } });

      expect(user1.password_hash).not.toBe(user2.password_hash);
    });

    test('should use salt (same password hashes differently)', async () => {
      const email1 = generateEmail('user1');
      const email2 = generateEmail('user2');

      await request(app)
        .post('/auth/register')
        .send({
          name: 'User 1',
          email: email1,
          password: 'samepassword'
        });

      await request(app)
        .post('/auth/register')
        .send({
          name: 'User 2',
          email: email2,
          password: 'samepassword'
        });

      const user1 = await User.findOne({ where: { email: email1 } });
      const user2 = await User.findOne({ where: { email: email2 } });

      // Even with same password, hashes should be different due to salt
      expect(user1.password_hash).not.toBe(user2.password_hash);
    });
  });
});
