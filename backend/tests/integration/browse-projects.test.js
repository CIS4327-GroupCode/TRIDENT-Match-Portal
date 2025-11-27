const request = require('supertest');
const express = require('express');
const sequelize = require('../../src/database');
const { User, Organization, Project } = require('../../src/database/models');
const bcrypt = require('bcrypt');

// Import routes
const projectRoutes = require('../../src/routes/projectRoutes');

// Setup test app
const app = express();
app.use(express.json());
app.use('/projects', projectRoutes);

describe('UC3: Browse & Search Projects - Integration Tests', () => {
  let nonprofitOrg1, nonprofitOrg2;
  let project1, project2, project3, project4, project5;

  beforeAll(async () => {
    // Ensure database connection
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clear database before each test
    await sequelize.query('TRUNCATE TABLE project_ideas CASCADE');
    await sequelize.query('TRUNCATE TABLE organization CASCADE');
    await sequelize.query('TRUNCATE TABLE _user RESTART IDENTITY CASCADE');

    // Create test users and organizations
    const hashedPassword = await bcrypt.hash('Test123!', 10);

    const nonprofit1 = await User.create({
      name: 'Nonprofit One',
      email: 'nonprofit1@example.com',
      password_hash: hashedPassword,
      role: 'nonprofit'
    });

    nonprofitOrg1 = await Organization.create({
      user_id: nonprofit1.id,
      name: 'Health First Organization',
      type: 'nonprofit',
      location: 'San Francisco, CA',
      mission: 'Improving community health',
      focus_areas: ['Health', 'Education']
    });

    const nonprofit2 = await User.create({
      name: 'Nonprofit Two',
      email: 'nonprofit2@example.com',
      password_hash: hashedPassword,
      role: 'nonprofit'
    });

    nonprofitOrg2 = await Organization.create({
      user_id: nonprofit2.id,
      name: 'Education Access Network',
      type: 'nonprofit',
      location: 'Boston, MA',
      mission: 'Expanding educational opportunities',
      focus_areas: ['Education', 'Youth Development']
    });

    // Create test projects with varied properties
    project1 = await Project.create({
      title: 'Community Health Survey',
      problem: 'Need to assess health disparities in underserved communities',
      outcomes: 'Comprehensive health assessment report',
      methods_required: 'Survey design, statistical analysis, data visualization',
      timeline: '6 months',
      budget_min: 10000,
      data_sensitivity: 'High',
      status: 'open',
      org_id: nonprofitOrg1.id
    });

    project2 = await Project.create({
      title: 'Youth Education Program Evaluation',
      problem: 'Evaluate effectiveness of after-school programs',
      outcomes: 'Impact assessment report with recommendations',
      methods_required: 'Mixed methods evaluation, focus groups, interviews',
      timeline: '12 months',
      budget_min: 15000,
      data_sensitivity: 'Medium',
      status: 'open',
      org_id: nonprofitOrg2.id
    });

    project3 = await Project.create({
      title: 'Environmental Impact Study',
      problem: 'Assess pollution levels in urban areas',
      outcomes: 'Environmental assessment report',
      methods_required: 'Data collection, GIS mapping, statistical analysis',
      timeline: '9 months',
      budget_min: 20000,
      data_sensitivity: 'Low',
      status: 'open',
      org_id: nonprofitOrg1.id
    });

    project4 = await Project.create({
      title: 'Internal Planning Document',
      problem: 'Strategic planning for next year',
      outcomes: 'Strategic plan',
      methods_required: 'Consulting',
      timeline: '3 months',
      budget_min: 5000,
      data_sensitivity: 'High',
      status: 'draft', // Not visible in browse
      org_id: nonprofitOrg1.id
    });

    project5 = await Project.create({
      title: 'Social Media Impact Research',
      problem: 'Understanding social media effects on youth mental health',
      outcomes: 'Research report with policy recommendations',
      methods_required: 'Survey design, qualitative interviews, data analysis',
      timeline: '18 months',
      budget_min: 25000,
      data_sensitivity: 'High',
      status: 'open',
      org_id: nonprofitOrg2.id
    });
  });

  describe('GET /projects/browse - Browse All Projects', () => {
    test('Should return all open projects', async () => {
      const response = await request(app)
        .get('/projects/browse');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.projects)).toBe(true);
      expect(response.body.projects.length).toBe(4); // Only open projects (excludes draft)
    });

    test('Should include organization details', async () => {
      const response = await request(app)
        .get('/projects/browse');

      expect(response.status).toBe(200);
      expect(response.body.projects[0]).toHaveProperty('organization');
      expect(response.body.projects[0].organization).toHaveProperty('name');
      expect(response.body.projects[0].organization).toHaveProperty('location');
      expect(response.body.projects[0].organization).toHaveProperty('focus_areas');
    });

    test('Should return projects in descending order (most recent first)', async () => {
      const response = await request(app)
        .get('/projects/browse');

      expect(response.status).toBe(200);
      const projectIds = response.body.projects.map(p => p.project_id);
      // Check if sorted in descending order
      for (let i = 0; i < projectIds.length - 1; i++) {
        expect(projectIds[i]).toBeGreaterThan(projectIds[i + 1]);
      }
    });

    test('Should include correct pagination metadata', async () => {
      const response = await request(app)
        .get('/projects/browse?page=1&limit=2');

      expect(response.status).toBe(200);
      expect(response.body.pagination).toMatchObject({
        total: 4,
        page: 1,
        limit: 2,
        totalPages: 2
      });
      expect(response.body.projects.length).toBe(2);
    });

    test('Should handle pagination correctly', async () => {
      const response = await request(app)
        .get('/projects/browse?page=2&limit=2');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBe(2);
      expect(response.body.pagination.page).toBe(2);
    });
  });

  describe('GET /projects/browse - Search Functionality', () => {
    test('Should search by title', async () => {
      const response = await request(app)
        .get('/projects/browse?search=health');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
      expect(response.body.projects.some(p => p.title.toLowerCase().includes('health'))).toBe(true);
    });

    test('Should search by problem description', async () => {
      const response = await request(app)
        .get('/projects/browse?search=disparities');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
      expect(response.body.projects[0].problem).toContain('disparities');
    });

    test('Should search by methods required', async () => {
      const response = await request(app)
        .get('/projects/browse?search=statistical%20analysis');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
      expect(response.body.projects.some(p => 
        p.methods_required && p.methods_required.toLowerCase().includes('statistical analysis')
      )).toBe(true);
    });

    test('Should search case-insensitively', async () => {
      const response = await request(app)
        .get('/projects/browse?search=EDUCATION');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
    });

    test('Should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/projects/browse?search=nonexistentterm12345');

      expect(response.status).toBe(200);
      expect(response.body.projects).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });
  });

  describe('GET /projects/browse - Filter by Methods', () => {
    test('Should filter by methods required', async () => {
      const response = await request(app)
        .get('/projects/browse?methods=survey%20design');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
      expect(response.body.projects.every(p => 
        p.methods_required && p.methods_required.toLowerCase().includes('survey design')
      )).toBe(true);
    });

    test('Should filter methods case-insensitively', async () => {
      const response = await request(app)
        .get('/projects/browse?methods=STATISTICAL');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
    });
  });

  describe('GET /projects/browse - Filter by Budget', () => {
    test('Should filter by minimum budget', async () => {
      const response = await request(app)
        .get('/projects/browse?budget_min=15000');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
      expect(response.body.projects.every(p => 
        parseFloat(p.budget_min) >= 15000
      )).toBe(true);
    });

    test('Should filter by maximum budget', async () => {
      const response = await request(app)
        .get('/projects/browse?budget_max=15000');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
      expect(response.body.projects.every(p => 
        parseFloat(p.budget_min) <= 15000
      )).toBe(true);
    });

    test('Should filter by budget range', async () => {
      const response = await request(app)
        .get('/projects/browse?budget_min=10000&budget_max=20000');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
      expect(response.body.projects.every(p => {
        const budget = parseFloat(p.budget_min);
        return budget >= 10000 && budget <= 20000;
      })).toBe(true);
    });
  });

  describe('GET /projects/browse - Filter by Data Sensitivity', () => {
    test('Should filter by data sensitivity level', async () => {
      const response = await request(app)
        .get('/projects/browse?data_sensitivity=High');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
      expect(response.body.projects.every(p => 
        p.data_sensitivity === 'High'
      )).toBe(true);
    });

    test('Should filter by Medium sensitivity', async () => {
      const response = await request(app)
        .get('/projects/browse?data_sensitivity=Medium');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBe(1);
      expect(response.body.projects[0].data_sensitivity).toBe('Medium');
    });
  });

  describe('GET /projects/browse - Filter by Timeline', () => {
    test('Should filter by timeline', async () => {
      const response = await request(app)
        .get('/projects/browse?timeline=6%20months');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
      expect(response.body.projects.some(p => 
        p.timeline && p.timeline.includes('6 months')
      )).toBe(true);
    });

    test('Should filter timeline case-insensitively', async () => {
      const response = await request(app)
        .get('/projects/browse?timeline=MONTHS');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
    });
  });

  describe('GET /projects/browse - Combined Filters', () => {
    test('Should apply multiple filters together', async () => {
      const response = await request(app)
        .get('/projects/browse?search=health&budget_min=5000&budget_max=15000&data_sensitivity=High');

      expect(response.status).toBe(200);
      // Should filter correctly
      response.body.projects.forEach(p => {
        const budget = parseFloat(p.budget_min);
        expect(budget).toBeGreaterThanOrEqual(5000);
        expect(budget).toBeLessThanOrEqual(15000);
        expect(p.data_sensitivity).toBe('High');
      });
    });

    test('Should return empty array when filters match nothing', async () => {
      const response = await request(app)
        .get('/projects/browse?search=health&budget_min=50000');

      expect(response.status).toBe(200);
      expect(response.body.projects).toEqual([]);
    });
  });

  describe('GET /projects/browse/:id - Get Public Project Details', () => {
    test('Should get public project with organization details', async () => {
      const response = await request(app)
        .get(`/projects/browse/${project1.project_id}`);

      expect(response.status).toBe(200);
      expect(response.body.project).toMatchObject({
        project_id: project1.project_id,
        title: project1.title,
        problem: project1.problem,
        status: 'open'
      });
      expect(response.body.project.organization).toHaveProperty('name');
      expect(response.body.project.organization).toHaveProperty('mission');
      expect(response.body.project.organization).toHaveProperty('website');
    });

    test('Should return 404 for draft projects', async () => {
      const response = await request(app)
        .get(`/projects/browse/${project4.project_id}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Project not found or not available');
    });

    test('Should return 404 for non-existent project', async () => {
      const response = await request(app)
        .get('/projects/browse/99999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('Should include full organization details', async () => {
      const response = await request(app)
        .get(`/projects/browse/${project2.project_id}`);

      expect(response.status).toBe(200);
      expect(response.body.project.organization).toMatchObject({
        name: nonprofitOrg2.name,
        type: nonprofitOrg2.type,
        location: nonprofitOrg2.location,
        mission: nonprofitOrg2.mission
      });
    });
  });

  describe('Browse - Edge Cases', () => {
    test('Should handle invalid page parameter gracefully', async () => {
      const response = await request(app)
        .get('/projects/browse?page=abc');

      expect(response.status).toBe(200);
      // Should default to page 1
      expect(response.body.pagination.page).toBe(1);
    });

    test('Should handle very large limit parameter', async () => {
      const response = await request(app)
        .get('/projects/browse?limit=1000');

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeLessThanOrEqual(1000);
    });

    test('Should handle special characters in search', async () => {
      const response = await request(app)
        .get('/projects/browse?search=%26%20special%20%24');

      expect(response.status).toBe(200);
      // Should not crash, may return empty results
    });

    test('Should not show projects from other statuses', async () => {
      // Update a project to in_progress
      await project3.update({ status: 'in_progress' });

      const response = await request(app)
        .get('/projects/browse');

      expect(response.status).toBe(200);
      expect(response.body.projects.some(p => p.project_id === project3.project_id)).toBe(false);
    });
  });
});
