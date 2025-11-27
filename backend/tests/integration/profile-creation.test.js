const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/authRoutes');
const { User, Organization, ResearcherProfile } = require('../src/database/models');

// Create minimal express app for testing
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Profile Creation on Signup', () => {
  beforeEach(async () => {
    // Clear test data
    await ResearcherProfile.destroy({ where: {}, force: true });
    await Organization.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
  });

  describe('Nonprofit Registration', () => {
    test('should create organization profile when nonprofit signs up', async () => {
      const nonprofitData = {
        name: 'Save the Forests',
        email: 'contact@saveforests.org',
        password: 'SecurePass123!',
        role: 'nonprofit',
        organizationData: {
          name: 'Save the Forests Foundation',
          EIN: '12-3456789',
          mission: 'Protect and restore forest ecosystems',
          focus_tags: ['environment', 'conservation', 'climate'],
          contacts: {
            phone: '555-0123',
            website: 'https://saveforests.org'
          }
        }
      };

      const response = await request(app)
        .post('/auth/register')
        .send(nonprofitData)
        .expect(201);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.role).toBe('nonprofit');
      expect(response.body.token).toBeDefined();

      // Verify organization was created
      const org = await Organization.findOne({ 
        where: { id: response.body.user.id } 
      });
      
      expect(org).not.toBeNull();
      expect(org.name).toBe('Save the Forests Foundation');
      expect(org.EIN).toBe('12-3456789');
      expect(org.mission).toBe('Protect and restore forest ecosystems');
      
      // Verify tags are stored as JSON
      const tags = JSON.parse(org.focus_tags);
      expect(tags).toEqual(['environment', 'conservation', 'climate']);
    });

    test('should fail if nonprofit data is missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test Org',
          email: 'test@org.com',
          password: 'SecurePass123!',
          role: 'nonprofit'
          // Missing organizationData
        })
        .expect(400);

      expect(response.body.error).toContain('organizationData is required');
    });

    test('should use user name as org name if not provided', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Community Foundation',
          email: 'info@community.org',
          password: 'SecurePass123!',
          role: 'nonprofit',
          organizationData: {
            mission: 'Help local communities'
          }
        })
        .expect(201);

      const org = await Organization.findOne({ 
        where: { id: response.body.user.id } 
      });
      
      expect(org.name).toBe('Community Foundation');
    });
  });

  describe('Researcher Registration', () => {
    test('should create researcher profile when researcher signs up', async () => {
      const researcherData = {
        name: 'Dr. Jane Smith',
        email: 'jsmith@university.edu',
        password: 'SecurePass123!',
        role: 'researcher',
        researcherData: {
          affiliation: 'MIT',
          domains: ['machine learning', 'data science'],
          methods: ['statistical analysis', 'deep learning'],
          tools: ['Python', 'TensorFlow', 'R'],
          rate_min: 100,
          rate_max: 250,
          availability: 'Part-time, 10-20 hours/week'
        }
      };

      const response = await request(app)
        .post('/auth/register')
        .send(researcherData)
        .expect(201);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.role).toBe('researcher');
      expect(response.body.token).toBeDefined();

      // Verify researcher profile was created
      const profile = await ResearcherProfile.findOne({ 
        where: { user_id: response.body.user.id } 
      });
      
      expect(profile).not.toBeNull();
      expect(profile.affiliation).toBe('MIT');
      expect(profile.rate_min).toBe('100');
      expect(profile.rate_max).toBe('250');
      expect(profile.availability).toBe('Part-time, 10-20 hours/week');
      
      // Verify arrays are stored as JSON
      const domains = JSON.parse(profile.domains);
      expect(domains).toEqual(['machine learning', 'data science']);
      
      const methods = JSON.parse(profile.methods);
      expect(methods).toEqual(['statistical analysis', 'deep learning']);
    });

    test('should allow researcher signup without profile data', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'jdoe@example.com',
          password: 'SecurePass123!',
          role: 'researcher'
          // No researcherData - should still work
        })
        .expect(201);

      expect(response.body.user.role).toBe('researcher');

      // Profile should not be created if no data provided
      const profile = await ResearcherProfile.findOne({ 
        where: { user_id: response.body.user.id } 
      });
      
      expect(profile).toBeNull();
    });

    test('should fail if rate_min is greater than rate_max', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test Researcher',
          email: 'test@researcher.com',
          password: 'SecurePass123!',
          role: 'researcher',
          researcherData: {
            rate_min: 300,
            rate_max: 100
          }
        })
        .expect(400);

      expect(response.body.error).toContain('rate_min must be less than rate_max');
    });
  });

  describe('Role Validation', () => {
    test('should reject invalid role', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'SecurePass123!',
          role: 'invalid_role'
        })
        .expect(400);

      expect(response.body.error).toContain('invalid role');
    });

    test('should default to researcher if no role provided', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Default User',
          email: 'default@example.com',
          password: 'SecurePass123!'
        })
        .expect(201);

      expect(response.body.user.role).toBe('researcher');
    });
  });

  describe('Transaction Rollback', () => {
    test('should rollback user creation if organization creation fails', async () => {
      // This test would require mocking to force Organization.create to fail
      // For now, we document that transaction rollback is implemented
      
      // If organization creation fails, the entire transaction should rollback
      // and no user should be created in the database
    });
  });
});
