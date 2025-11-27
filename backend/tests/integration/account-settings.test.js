const request = require('supertest');
const express = require('express');
const sequelize = require('../../src/database');
const { User, UserPreferences, Organization, ResearcherProfile } = require('../../src/database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import routes
const userRoutes = require('../../src/routes/userRoutes');
const organizationRoutes = require('../../src/routes/organizationRoutes');
const researcherRoutes = require('../../src/routes/researcherRoutes');
const adminRoutes = require('../../src/routes/adminRoutes');

// Setup test app
const app = express();
app.use(express.json());
app.use('/users', userRoutes);
app.use('/organizations', organizationRoutes);
app.use('/researchers', researcherRoutes);
app.use('/admin', adminRoutes);

describe('UC6: Manage Account Settings - Integration Tests', () => {
  let testUser;
  let testToken;
  let nonprofitUser;
  let nonprofitToken;
  let researcherUser;
  let researcherToken;
  let adminUser;
  let adminToken;

  beforeAll(async () => {
    // Ensure database connection
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clear database before each test - use raw deletes to bypass paranoid mode
    await sequelize.query('TRUNCATE TABLE user_preferences CASCADE');
    await sequelize.query('TRUNCATE TABLE researcher_profile CASCADE');
    await sequelize.query('TRUNCATE TABLE organization CASCADE');
    await sequelize.query('TRUNCATE TABLE _user RESTART IDENTITY CASCADE');

    // Create test users
    const hashedPassword = await bcrypt.hash('Test123!', 10);

    // Regular researcher user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password_hash: hashedPassword,
      role: 'researcher'
    });
    testToken = jwt.sign({ userId: testUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Create researcher profile
    await ResearcherProfile.create({
      user_id: testUser.id,
      title: 'PhD Candidate',
      institution: 'Test University',
      expertise: ['Machine Learning'],
      research_interests: ['AI'],
      hourly_rate_min: 50,
      hourly_rate_max: 100
    });

    // Nonprofit user
    nonprofitUser = await User.create({
      name: 'Nonprofit User',
      email: 'nonprofit@example.com',
      password_hash: hashedPassword,
      role: 'nonprofit'
    });
    nonprofitToken = jwt.sign({ userId: nonprofitUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Create organization
    await Organization.create({
      user_id: nonprofitUser.id,
      name: 'Test Org',
      type: 'nonprofit',
      location: 'New York',
      mission: 'Test mission',
      focus_areas: ['Education']
    });

    // Researcher user
    researcherUser = await User.create({
      name: 'Researcher User',
      email: 'researcher@example.com',
      password_hash: hashedPassword,
      role: 'researcher'
    });
    researcherToken = jwt.sign({ userId: researcherUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    await ResearcherProfile.create({
      user_id: researcherUser.id,
      title: 'Professor',
      institution: 'Research Institute',
      expertise: ['Data Science'],
      research_interests: ['Statistics'],
      hourly_rate_min: 75,
      hourly_rate_max: 150
    });

    // Admin user
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      role: 'admin'
    });
    adminToken = jwt.sign({ userId: adminUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  });

  describe('GET /users/me - Get User Profile', () => {
    test('should return user profile with preferences', async () => {
      const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id', testUser.id);
      expect(response.body.user).toHaveProperty('name', 'Test User');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('role', 'researcher');
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    test('should return 401 without authentication', async () => {
      const response = await request(app).get('/users/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Authentication required');
    });
  });

  describe('PUT /users/me - Update User Profile', () => {
    test('should update user name', async () => {
      const response = await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.user).toHaveProperty('name', 'Updated Name');
    });

    test('should update user email', async () => {
      const response = await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ email: 'newemail@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email', 'newemail@example.com');
    });

    test('should reject duplicate email', async () => {
      const response = await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ email: 'nonprofit@example.com' });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Email already in use');
    });

    test('should return 400 with no update fields', async () => {
      const response = await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${testToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No update fields provided');
    });
  });

  describe('PUT /users/me/password - Change Password', () => {
    test('should change password with correct current password', async () => {
      const response = await request(app)
        .put('/users/me/password')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          currentPassword: 'Test123!',
          newPassword: 'NewPassword456!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Password changed successfully');

      // Verify new password works
      const user = await User.findByPk(testUser.id);
      const isValid = await bcrypt.compare('NewPassword456!', user.password_hash);
      expect(isValid).toBe(true);
    });

    test('should reject incorrect current password', async () => {
      const response = await request(app)
        .put('/users/me/password')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          currentPassword: 'WrongPassword',
          newPassword: 'NewPassword456!'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Current password is incorrect');
    });

    test('should reject weak password', async () => {
      const response = await request(app)
        .put('/users/me/password')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          currentPassword: 'Test123!',
          newPassword: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'New password must be at least 8 characters long');
    });
  });

  describe('GET /users/me/preferences - Get Preferences', () => {
    test('should create default preferences if none exist', async () => {
      const response = await request(app)
        .get('/users/me/preferences')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.preferences).toHaveProperty('email_notifications', true);
      expect(response.body.preferences).toHaveProperty('email_messages', true);
      expect(response.body.preferences).toHaveProperty('marketing_emails', false);
    });

    test('should return existing preferences', async () => {
      // Create preferences first
      await UserPreferences.create({
        user_id: testUser.id,
        email_notifications: false,
        marketing_emails: true
      });

      const response = await request(app)
        .get('/users/me/preferences')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.preferences).toHaveProperty('email_notifications', false);
      expect(response.body.preferences).toHaveProperty('marketing_emails', true);
    });
  });

  describe('PUT /users/me/preferences - Update Preferences', () => {
    test('should update notification preferences', async () => {
      const response = await request(app)
        .put('/users/me/preferences')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          email_notifications: false,
          email_messages: false,
          marketing_emails: true
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Preferences updated successfully');
      expect(response.body.preferences).toHaveProperty('email_notifications', false);
      expect(response.body.preferences).toHaveProperty('email_messages', false);
      expect(response.body.preferences).toHaveProperty('marketing_emails', true);
    });

    test('should reject non-boolean values', async () => {
      const response = await request(app)
        .put('/users/me/preferences')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          email_notifications: 'yes'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No valid preference fields provided');
    });
  });

  describe('DELETE /users/me - Soft Delete Account', () => {
    test('should soft delete user account', async () => {
      const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify user is soft deleted
      const user = await User.findByPk(testUser.id, { paranoid: false });
      expect(user.deleted_at).not.toBeNull();
    });
  });

  describe('PUT /organizations/me - Update Organization', () => {
    test('should update organization details', async () => {
      const response = await request(app)
        .put('/organizations/me')
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          name: 'Updated Org Name',
          website: 'https://updated.org',
          mission: 'Updated mission'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Organization updated successfully');
      expect(response.body.organization).toHaveProperty('name', 'Updated Org Name');
      expect(response.body.organization).toHaveProperty('website', 'https://updated.org');
    });

    test('should reject non-nonprofit users', async () => {
      const response = await request(app)
        .put('/organizations/me')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ name: 'Should Fail' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Only nonprofit users can update organization settings');
    });
  });

  describe('PUT /researchers/me - Update Researcher Profile', () => {
    test('should update researcher profile', async () => {
      const response = await request(app)
        .put('/researchers/me')
        .set('Authorization', `Bearer ${researcherToken}`)
        .send({
          title: 'Senior Researcher',
          hourly_rate_min: 100,
          hourly_rate_max: 200
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Researcher profile updated successfully');
      expect(response.body.profile).toHaveProperty('title', 'Senior Researcher');
      expect(response.body.profile).toHaveProperty('hourly_rate_min', 100);
      expect(response.body.profile).toHaveProperty('hourly_rate_max', 200);
    });

    test('should reject invalid rate range', async () => {
      const response = await request(app)
        .put('/researchers/me')
        .set('Authorization', `Bearer ${researcherToken}`)
        .send({
          hourly_rate_min: 200,
          hourly_rate_max: 100
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Minimum rate cannot exceed maximum rate');
    });

    test('should reject non-researcher users', async () => {
      const response = await request(app)
        .put('/researchers/me')
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ title: 'Should Fail' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Only researcher users can update researcher profile settings');
    });
  });

  describe('DELETE /admin/users/:id - Hard Delete User', () => {
    test('should require admin role', async () => {
      const response = await request(app)
        .delete(`/admin/users/${testUser.id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ confirmation: 'DELETE' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Admin access required');
    });

    test('should require DELETE confirmation', async () => {
      const response = await request(app)
        .delete(`/admin/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Confirmation required');
    });

    test('should permanently delete user with confirmation', async () => {
      const response = await request(app)
        .delete(`/admin/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ confirmation: 'DELETE' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify user is permanently deleted
      const user = await User.findByPk(testUser.id, { paranoid: false });
      expect(user).toBeNull();
    });
  });

  describe('POST /admin/users/:id/restore - Restore User', () => {
    test('should restore soft-deleted user', async () => {
      // First soft delete the user
      await testUser.destroy();

      const response = await request(app)
        .post(`/admin/users/${testUser.id}/restore`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User account restored successfully');

      // Verify user is restored
      const user = await User.findByPk(testUser.id);
      expect(user).not.toBeNull();
      expect(user.deleted_at).toBeNull();
    });

    test('should reject restoring non-deleted user', async () => {
      const response = await request(app)
        .post(`/admin/users/${testUser.id}/restore`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'User is not deleted');
    });

    test('should require admin role', async () => {
      const response = await request(app)
        .post(`/admin/users/${testUser.id}/restore`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Admin access required');
    });
  });
});
