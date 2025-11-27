const request = require('supertest');
const express = require('express');
const sequelize = require('../../src/database');
const { User, Organization, Project } = require('../../src/database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import routes
const projectRoutes = require('../../src/routes/projectRoutes');

// Setup test app
const app = express();
app.use(express.json());
app.use('/projects', projectRoutes);

describe('UC7: Create Project Brief - Integration Tests', () => {
  let nonprofitUser;
  let nonprofitToken;
  let nonprofitOrg;
  let researcherUser;
  let researcherToken;
  let testProject;

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

    // Create test users
    const hashedPassword = await bcrypt.hash('Test123!', 10);

    // Nonprofit user
    nonprofitUser = await User.create({
      name: 'Nonprofit User',
      email: 'nonprofit@example.com',
      password_hash: hashedPassword,
      role: 'nonprofit'
    });
    nonprofitToken = jwt.sign({ userId: nonprofitUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Create organization for nonprofit
    nonprofitOrg = await Organization.create({
      user_id: nonprofitUser.id,
      name: 'Test Nonprofit',
      type: 'nonprofit',
      location: 'San Francisco',
      mission: 'Helping communities',
      focus_areas: ['Education', 'Health']
    });

    // Researcher user (for permission tests)
    researcherUser = await User.create({
      name: 'Researcher User',
      email: 'researcher@example.com',
      password_hash: hashedPassword,
      role: 'researcher'
    });
    researcherToken = jwt.sign({ userId: researcherUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Create a test project
    testProject = await Project.create({
      title: 'Existing Project',
      problem: 'Test problem',
      outcomes: 'Test outcomes',
      methods_required: 'Statistical analysis',
      timeline: '6 months',
      budget_min: 5000,
      data_sensitivity: 'Low',
      status: 'draft',
      org_id: nonprofitOrg.id
    });
  });

  describe('POST /projects - Create Project', () => {
    test('Should create a new project for nonprofit user', async () => {
      const newProject = {
        title: 'Community Health Study',
        problem: 'Need to understand health disparities in our community',
        outcomes: 'Comprehensive health assessment report',
        methods_required: 'Survey design, statistical analysis, data visualization',
        timeline: '12 months',
        budget_min: 10000,
        data_sensitivity: 'Medium',
        status: 'draft'
      };

      const response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Project created successfully');
      expect(response.body.project).toMatchObject({
        title: newProject.title,
        problem: newProject.problem,
        outcomes: newProject.outcomes,
        methods_required: newProject.methods_required,
        timeline: newProject.timeline,
        budget_min: '10000.00',
        data_sensitivity: newProject.data_sensitivity,
        status: newProject.status,
        org_id: nonprofitOrg.id
      });
      expect(response.body.project).toHaveProperty('project_id');
    });

    test('Should create project with minimal fields (title only)', async () => {
      const response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ title: 'Minimal Project' });

      expect(response.status).toBe(201);
      expect(response.body.project.title).toBe('Minimal Project');
      expect(response.body.project.status).toBe('draft'); // Default status
    });

    test('Should create project with status "open"', async () => {
      const response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ 
          title: 'Open Project',
          status: 'open'
        });

      expect(response.status).toBe(201);
      expect(response.body.project.status).toBe('open');
    });

    test('Should fail without authentication', async () => {
      const response = await request(app)
        .post('/projects')
        .send({ title: 'Unauthorized Project' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('Should fail if user is not nonprofit', async () => {
      const response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${researcherToken}`)
        .send({ title: 'Researcher Project' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Only nonprofit users can create projects');
    });

    test('Should fail without title', async () => {
      const response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ problem: 'No title provided' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Project title is required');
    });

    test('Should fail with empty title', async () => {
      const response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ title: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Project title is required');
    });

    test('Should fail with negative budget', async () => {
      const response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ 
          title: 'Budget Test',
          budget_min: -1000
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Budget must be a non-negative number');
    });

    test('Should fail with invalid status', async () => {
      const response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ 
          title: 'Status Test',
          status: 'invalid_status'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Status must be one of:');
    });
  });

  describe('GET /projects - Get All Projects', () => {
    test('Should get all projects for nonprofit organization', async () => {
      // Create additional projects
      await Project.create({
        title: 'Second Project',
        status: 'open',
        org_id: nonprofitOrg.id
      });

      const response = await request(app)
        .get('/projects')
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(Array.isArray(response.body.projects)).toBe(true);
      expect(response.body.projects.length).toBe(2);
    });

    test('Should filter projects by status', async () => {
      await Project.create({
        title: 'Open Project',
        status: 'open',
        org_id: nonprofitOrg.id
      });

      const response = await request(app)
        .get('/projects?status=open')
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBe(1);
      expect(response.body.projects[0].status).toBe('open');
    });

    test('Should return empty array if no projects exist', async () => {
      await Project.destroy({ where: { org_id: nonprofitOrg.id } });

      const response = await request(app)
        .get('/projects')
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body.projects).toEqual([]);
    });

    test('Should fail without authentication', async () => {
      const response = await request(app)
        .get('/projects');

      expect(response.status).toBe(401);
    });

    test('Should fail if user is not nonprofit', async () => {
      const response = await request(app)
        .get('/projects')
        .set('Authorization', `Bearer ${researcherToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Only nonprofit users can access projects');
    });
  });

  describe('GET /projects/:id - Get Single Project', () => {
    test('Should get a specific project by ID', async () => {
      const response = await request(app)
        .get(`/projects/${testProject.project_id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body.project).toMatchObject({
        project_id: testProject.project_id,
        title: testProject.title,
        problem: testProject.problem,
        org_id: nonprofitOrg.id
      });
    });

    test('Should fail if project does not exist', async () => {
      const response = await request(app)
        .get('/projects/99999')
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Project not found');
    });

    test('Should fail without authentication', async () => {
      const response = await request(app)
        .get(`/projects/${testProject.project_id}`);

      expect(response.status).toBe(401);
    });

    test('Should fail if user is not nonprofit', async () => {
      const response = await request(app)
        .get(`/projects/${testProject.project_id}`)
        .set('Authorization', `Bearer ${researcherToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /projects/:id - Update Project', () => {
    test('Should update project successfully', async () => {
      const updates = {
        title: 'Updated Project Title',
        status: 'open',
        budget_min: 15000
      };

      const response = await request(app)
        .put(`/projects/${testProject.project_id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Project updated successfully');
      expect(response.body.project.title).toBe(updates.title);
      expect(response.body.project.status).toBe(updates.status);
      expect(response.body.project.budget_min).toBe('15000.00');
    });

    test('Should update only provided fields', async () => {
      const originalTitle = testProject.title;
      
      const response = await request(app)
        .put(`/projects/${testProject.project_id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ status: 'open' });

      expect(response.status).toBe(200);
      expect(response.body.project.title).toBe(originalTitle);
      expect(response.body.project.status).toBe('open');
    });

    test('Should fail if project does not exist', async () => {
      const response = await request(app)
        .put('/projects/99999')
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Project not found');
    });

    test('Should fail with no valid update fields', async () => {
      const response = await request(app)
        .put(`/projects/${testProject.project_id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ invalid_field: 'value' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No valid update fields provided');
    });

    test('Should fail with empty title', async () => {
      const response = await request(app)
        .put(`/projects/${testProject.project_id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ title: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Project title cannot be empty');
    });

    test('Should fail with negative budget', async () => {
      const response = await request(app)
        .put(`/projects/${testProject.project_id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ budget_min: -500 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Budget must be a non-negative number');
    });

    test('Should fail with invalid status', async () => {
      const response = await request(app)
        .put(`/projects/${testProject.project_id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ status: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Status must be one of:');
    });

    test('Should fail without authentication', async () => {
      const response = await request(app)
        .put(`/projects/${testProject.project_id}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(401);
    });

    test('Should fail if user is not nonprofit', async () => {
      const response = await request(app)
        .put(`/projects/${testProject.project_id}`)
        .set('Authorization', `Bearer ${researcherToken}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /projects/:id - Delete Project', () => {
    test('Should delete project successfully', async () => {
      const response = await request(app)
        .delete(`/projects/${testProject.project_id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Project deleted successfully');

      // Verify project is deleted
      const project = await Project.findByPk(testProject.project_id);
      expect(project).toBeNull();
    });

    test('Should fail if project does not exist', async () => {
      const response = await request(app)
        .delete('/projects/99999')
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Project not found');
    });

    test('Should fail without authentication', async () => {
      const response = await request(app)
        .delete(`/projects/${testProject.project_id}`);

      expect(response.status).toBe(401);
    });

    test('Should fail if user is not nonprofit', async () => {
      const response = await request(app)
        .delete(`/projects/${testProject.project_id}`)
        .set('Authorization', `Bearer ${researcherToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Authorization - Organization Ownership', () => {
    let anotherNonprofit;
    let anotherToken;
    let anotherOrg;
    let anotherProject;

    beforeEach(async () => {
      // Create another nonprofit with their own organization
      const hashedPassword = await bcrypt.hash('Test123!', 10);
      
      anotherNonprofit = await User.create({
        name: 'Another Nonprofit',
        email: 'another@example.com',
        password_hash: hashedPassword,
        role: 'nonprofit'
      });
      anotherToken = jwt.sign({ userId: anotherNonprofit.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      anotherOrg = await Organization.create({
        user_id: anotherNonprofit.id,
        name: 'Another Org',
        type: 'nonprofit',
        location: 'Boston'
      });

      anotherProject = await Project.create({
        title: 'Another Org Project',
        org_id: anotherOrg.id
      });
    });

    test('Should not allow access to another organization\'s project', async () => {
      const response = await request(app)
        .get(`/projects/${anotherProject.project_id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Project not found');
    });

    test('Should not allow updating another organization\'s project', async () => {
      const response = await request(app)
        .put(`/projects/${anotherProject.project_id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({ title: 'Hacked Title' });

      expect(response.status).toBe(404);
    });

    test('Should not allow deleting another organization\'s project', async () => {
      const response = await request(app)
        .delete(`/projects/${anotherProject.project_id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(404);
    });
  });
});
