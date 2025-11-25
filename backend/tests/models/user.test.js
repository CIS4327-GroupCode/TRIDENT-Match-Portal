/**
 * User Model Tests
 * 
 * Tests for the User Sequelize model
 */

const { User } = require('../../src/database/models');
const {
  setupTestDatabase,
  syncDatabase,
  clearDatabase,
  closeDatabase,
  generateEmail,
  expectToReject
} = require('../utils/testHelper');
const bcrypt = require('bcrypt');

describe('User Model', () => {
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

  describe('Model Definition', () => {
    test('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password_hash: await bcrypt.hash('password123', 10),
        role: 'researcher',
        mfa_enabled: false
      };

      const user = await User.create(userData);

      expect(user.id).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.role).toBe('researcher');
      expect(user.mfa_enabled).toBe(false);
      expect(user.created_at).toBeDefined();
      expect(user.updated_at).toBeDefined();
    });

    test('should auto-increment ID', async () => {
      const password = await bcrypt.hash('password123', 10);
      
      const user1 = await User.create({
        name: 'User 1',
        email: generateEmail('user1'),
        password_hash: password,
        role: 'researcher'
      });

      const user2 = await User.create({
        name: 'User 2',
        email: generateEmail('user2'),
        password_hash: password,
        role: 'researcher'
      });

      expect(user2.id).toBeGreaterThan(user1.id);
    });

    test('should have default timestamps', async () => {
      const user = await User.create({
        name: 'Test User',
        email: generateEmail(),
        password_hash: 'hash',
        role: 'researcher'
      });

      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);
    });

    test('should update updated_at on save', async () => {
      const user = await User.create({
        name: 'Test User',
        email: generateEmail(),
        password_hash: 'hash',
        role: 'researcher'
      });

      const originalUpdatedAt = user.updated_at;
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100));
      
      user.name = 'Updated Name';
      await user.save();

      expect(user.updated_at.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Validations', () => {
    test('should require name', async () => {
      const error = await expectToReject(
        User.create({
          email: generateEmail(),
          password_hash: 'hash',
          role: 'researcher'
        })
      );

      expect(error.name).toBe('SequelizeValidationError');
    });

    test('should require email', async () => {
      const error = await expectToReject(
        User.create({
          name: 'Test User',
          password_hash: 'hash',
          role: 'researcher'
        })
      );

      expect(error.name).toBe('SequelizeValidationError');
    });

    test('should validate email format', async () => {
      const error = await expectToReject(
        User.create({
          name: 'Test User',
          email: 'invalid-email',
          password_hash: 'hash',
          role: 'researcher'
        })
      );

      expect(error.name).toBe('SequelizeValidationError');
      expect(error.errors[0].path).toBe('email');
    });

    test('should require unique email', async () => {
      const email = generateEmail();
      const password = await bcrypt.hash('password123', 10);

      await User.create({
        name: 'User 1',
        email: email,
        password_hash: password,
        role: 'researcher'
      });

      const error = await expectToReject(
        User.create({
          name: 'User 2',
          email: email,
          password_hash: password,
          role: 'researcher'
        })
      );

      expect(error.name).toBe('SequelizeUniqueConstraintError');
    });

    test('should normalize email to lowercase', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password_hash: 'hash',
        role: 'researcher'
      });

      expect(user.email).toBe('test@example.com');
    });

    test('should trim email whitespace', async () => {
      const user = await User.create({
        name: 'Test User',
        email: '  test@example.com  ',
        password_hash: 'hash',
        role: 'researcher'
      });

      expect(user.email).toBe('test@example.com');
    });

    test('should require password_hash', async () => {
      const error = await expectToReject(
        User.create({
          name: 'Test User',
          email: generateEmail(),
          role: 'researcher'
        })
      );

      expect(error.name).toBe('SequelizeValidationError');
    });

    test('should validate role enum', async () => {
      const error = await expectToReject(
        User.create({
          name: 'Test User',
          email: generateEmail(),
          password_hash: 'hash',
          role: 'invalid_role'
        })
      );

      expect(error.name).toBe('SequelizeDatabaseError');
    });

    test('should accept valid roles', async () => {
      const roles = ['researcher', 'nonprofit', 'admin'];
      const password = await bcrypt.hash('password123', 10);

      for (const role of roles) {
        const user = await User.create({
          name: 'Test User',
          email: generateEmail(),
          password_hash: password,
          role: role
        });

        expect(user.role).toBe(role);
      }
    });

    test('should default role to researcher', async () => {
      const user = await User.create({
        name: 'Test User',
        email: generateEmail(),
        password_hash: 'hash'
      });

      expect(user.role).toBe('researcher');
    });

    test('should default mfa_enabled to false', async () => {
      const user = await User.create({
        name: 'Test User',
        email: generateEmail(),
        password_hash: 'hash',
        role: 'researcher'
      });

      expect(user.mfa_enabled).toBe(false);
    });
  });

  describe('Instance Methods', () => {
    test('toSafeObject should exclude password_hash', async () => {
      const user = await User.create({
        name: 'Test User',
        email: generateEmail(),
        password_hash: 'secret_hash',
        role: 'researcher'
      });

      const safeUser = user.toSafeObject();

      expect(safeUser.password_hash).toBeUndefined();
      expect(safeUser.id).toBeDefined();
      expect(safeUser.name).toBeDefined();
      expect(safeUser.email).toBeDefined();
      expect(safeUser.role).toBeDefined();
    });
  });

  describe('Class Methods', () => {
    test('findByEmail should find user by email', async () => {
      const email = generateEmail();
      
      await User.create({
        name: 'Test User',
        email: email,
        password_hash: 'hash',
        role: 'researcher'
      });

      const found = await User.findByEmail(email);

      expect(found).toBeDefined();
      expect(found.email).toBe(email);
    });

    test('findByEmail should return null for non-existent email', async () => {
      const found = await User.findByEmail('nonexistent@example.com');

      expect(found).toBeNull();
    });

    test('findByEmail should be case-insensitive', async () => {
      const email = 'test@example.com';
      
      await User.create({
        name: 'Test User',
        email: email,
        password_hash: 'hash',
        role: 'researcher'
      });

      const found = await User.findByEmail('TEST@EXAMPLE.COM');

      expect(found).toBeDefined();
      expect(found.email).toBe(email);
    });
  });

  describe('Query Operations', () => {
    test('should find user by primary key', async () => {
      const user = await User.create({
        name: 'Test User',
        email: generateEmail(),
        password_hash: 'hash',
        role: 'researcher'
      });

      const found = await User.findByPk(user.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(user.id);
    });

    test('should find all users', async () => {
      await User.create({
        name: 'User 1',
        email: generateEmail('user1'),
        password_hash: 'hash',
        role: 'researcher'
      });

      await User.create({
        name: 'User 2',
        email: generateEmail('user2'),
        password_hash: 'hash',
        role: 'nonprofit'
      });

      const users = await User.findAll();

      expect(users).toHaveLength(2);
    });

    test('should filter users by role', async () => {
      await User.create({
        name: 'Researcher',
        email: generateEmail('researcher'),
        password_hash: 'hash',
        role: 'researcher'
      });

      await User.create({
        name: 'Nonprofit',
        email: generateEmail('nonprofit'),
        password_hash: 'hash',
        role: 'nonprofit'
      });

      const researchers = await User.findAll({ where: { role: 'researcher' } });

      expect(researchers).toHaveLength(1);
      expect(researchers[0].role).toBe('researcher');
    });

    test('should count users', async () => {
      await User.create({
        name: 'User 1',
        email: generateEmail('user1'),
        password_hash: 'hash',
        role: 'researcher'
      });

      await User.create({
        name: 'User 2',
        email: generateEmail('user2'),
        password_hash: 'hash',
        role: 'researcher'
      });

      const count = await User.count();

      expect(count).toBe(2);
    });

    test('should update user', async () => {
      const user = await User.create({
        name: 'Original Name',
        email: generateEmail(),
        password_hash: 'hash',
        role: 'researcher'
      });

      user.name = 'Updated Name';
      await user.save();

      const updated = await User.findByPk(user.id);

      expect(updated.name).toBe('Updated Name');
    });

    test('should delete user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: generateEmail(),
        password_hash: 'hash',
        role: 'researcher'
      });

      await user.destroy();

      const found = await User.findByPk(user.id);

      expect(found).toBeNull();
    });
  });
});
