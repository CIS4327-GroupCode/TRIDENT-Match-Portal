const request = require('supertest');
const app = require('../src/index');
const { sequelize } = require('../src/database');
const User = require('../src/database/models/User');
const Organization = require('../src/database/models/Organization');
const Project = require('../src/database/models/Project');
const Milestone = require('../src/database/models/Milestone');

describe('UC4: Manage Project Milestones', () => {
  let nonprofitToken;
  let nonprofitUser;
  let nonprofitOrg;
  let testProject;
  let otherNonprofitToken;
  let otherOrg;
  let researcherToken;

  beforeAll(async () => {
    // Ensure database is synced
    await sequelize.sync({ force: false });
  });

  beforeEach(async () => {
    // Clean up test data
    await Milestone.destroy({ where: {}, force: true });
    await Project.destroy({ where: {}, force: true });
    await Organization.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    // Create nonprofit organization
    nonprofitOrg = await Organization.create({
      name: 'Test Nonprofit',
      EIN: '12-3456789',
      mission: 'Test mission'
    });

    // Create nonprofit user
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    nonprofitUser = await User.create({
      name: 'Nonprofit User',
      email: 'nonprofit@test.com',
      password: hashedPassword,
      role: 'nonprofit',
      organization_id: nonprofitOrg.id
    });

    // Login nonprofit user
    const nonprofitLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonprofit@test.com',
        password: 'password123'
      });
    nonprofitToken = nonprofitLogin.body.token;

    // Create another nonprofit organization and user
    otherOrg = await Organization.create({
      name: 'Other Nonprofit',
      EIN: '98-7654321',
      mission: 'Other mission'
    });

    const otherNonprofitUser = await User.create({
      name: 'Other Nonprofit',
      email: 'other@test.com',
      password: hashedPassword,
      role: 'nonprofit',
      organization_id: otherOrg.id
    });

    const otherLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'other@test.com',
        password: 'password123'
      });
    otherNonprofitToken = otherLogin.body.token;

    // Create researcher user
    const researcherUser = await User.create({
      name: 'Researcher User',
      email: 'researcher@test.com',
      password: hashedPassword,
      role: 'researcher'
    });

    const researcherLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'researcher@test.com',
        password: 'password123'
      });
    researcherToken = researcherLogin.body.token;

    // Create test project
    testProject = await Project.create({
      title: 'Test Project',
      problem: 'Test problem',
      status: 'open',
      org_id: nonprofitOrg.id
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/projects/:projectId/milestones - Create Milestone', () => {
    it('should create a milestone successfully', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dueDate = tomorrow.toISOString().split('T')[0];

      const response = await request(app)
        .post(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          name: 'Project Kickoff',
          description: 'Initial project meeting',
          due_date: dueDate,
          status: 'pending'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Milestone created successfully');
      expect(response.body.milestone).toBeDefined();
      expect(response.body.milestone.name).toBe('Project Kickoff');
      expect(response.body.milestone.status).toBe('pending');
    });

    it('should fail without milestone name', async () => {
      const response = await request(app)
        .post(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          description: 'Missing name'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('name is required');
    });

    it('should fail with empty milestone name', async () => {
      const response = await request(app)
        .post(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          name: '   ',
          description: 'Empty name'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('name is required');
    });

    it('should fail with past due date for new milestone', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const pastDate = yesterday.toISOString().split('T')[0];

      const response = await request(app)
        .post(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          name: 'Past Milestone',
          due_date: pastDate
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Due date must be');
    });

    it('should fail with invalid status', async () => {
      const response = await request(app)
        .post(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          name: 'Test Milestone',
          status: 'invalid_status'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid status');
    });

    it('should fail for non-existent project', async () => {
      const response = await request(app)
        .post('/api/projects/99999/milestones')
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          name: 'Test Milestone'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Project not found');
    });

    it('should fail when nonprofit tries to create milestone for another org\'s project', async () => {
      const response = await request(app)
        .post(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', `Bearer ${otherNonprofitToken}`)
        .send({
          name: 'Unauthorized Milestone'
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Access denied');
    });

    it('should fail for researcher role', async () => {
      const response = await request(app)
        .post(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', `Bearer ${researcherToken}`)
        .send({
          name: 'Researcher Milestone'
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Access denied');
    });

    it('should set completed_at when status is completed', async () => {
      const response = await request(app)
        .post(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          name: 'Already Completed',
          status: 'completed'
        });

      expect(response.status).toBe(201);
      expect(response.body.milestone.completed_at).toBeDefined();
      expect(response.body.milestone.completed_at).not.toBeNull();
    });
  });

  describe('GET /api/projects/:projectId/milestones - List Milestones', () => {
    beforeEach(async () => {
      // Create test milestones
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const futureDate = tomorrow.toISOString().split('T')[0];
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const pastDate = yesterday.toISOString().split('T')[0];

      await Milestone.create({
        project_id: testProject.project_id,
        name: 'Pending Milestone',
        status: 'pending',
        due_date: futureDate
      });

      await Milestone.create({
        project_id: testProject.project_id,
        name: 'In Progress Milestone',
        status: 'in_progress',
        due_date: futureDate
      });

      await Milestone.create({
        project_id: testProject.project_id,
        name: 'Completed Milestone',
        status: 'completed',
        completed_at: new Date()
      });

      await Milestone.create({
        project_id: testProject.project_id,
        name: 'Overdue Milestone',
        status: 'in_progress',
        due_date: pastDate
      });
    });

    it('should list all milestones for a project', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body.milestones).toBeDefined();
      expect(response.body.count).toBe(4);
      expect(response.body.project_id).toBe(testProject.project_id);
    });

    it('should filter milestones by status', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject.project_id}/milestones?status=completed`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      expect(response.body.milestones[0].status).toBe('completed');
    });

    it('should filter overdue milestones', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject.project_id}/milestones?overdue=true`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBeGreaterThanOrEqual(1);
      expect(response.body.milestones[0].is_overdue).toBe(true);
    });

    it('should include computed fields', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      const milestone = response.body.milestones[0];
      expect(milestone).toHaveProperty('is_overdue');
      expect(milestone).toHaveProperty('days_until_due');
      expect(milestone).toHaveProperty('computed_status');
    });

    it('should fail with invalid status filter', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject.project_id}/milestones?status=invalid`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid status');
    });

    it('should allow researchers to view milestones', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', `Bearer ${researcherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.milestones).toBeDefined();
    });
  });

  describe('GET /api/projects/:projectId/milestones/:id - Get Single Milestone', () => {
    let testMilestone;

    beforeEach(async () => {
      testMilestone = await Milestone.create({
        project_id: testProject.project_id,
        name: 'Test Milestone',
        description: 'Test description',
        status: 'pending'
      });
    });

    it('should get milestone details', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body.milestone).toBeDefined();
      expect(response.body.milestone.name).toBe('Test Milestone');
      expect(response.body.milestone.is_overdue).toBeDefined();
      expect(response.body.milestone.computed_status).toBeDefined();
    });

    it('should fail for non-existent milestone', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject.project_id}/milestones/99999`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('PUT /api/projects/:projectId/milestones/:id - Update Milestone', () => {
    let testMilestone;

    beforeEach(async () => {
      testMilestone = await Milestone.create({
        project_id: testProject.project_id,
        name: 'Original Name',
        status: 'pending'
      });
    });

    it('should update milestone name', async () => {
      const response = await request(app)
        .put(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('updated successfully');
      expect(response.body.milestone.name).toBe('Updated Name');
    });

    it('should update milestone status', async () => {
      const response = await request(app)
        .put(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          status: 'in_progress'
        });

      expect(response.status).toBe(200);
      expect(response.body.milestone.status).toBe('in_progress');
    });

    it('should set completed_at when changing status to completed', async () => {
      const response = await request(app)
        .put(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          status: 'completed'
        });

      expect(response.status).toBe(200);
      expect(response.body.milestone.completed_at).toBeDefined();
      expect(response.body.milestone.completed_at).not.toBeNull();
    });

    it('should clear completed_at when changing from completed to another status', async () => {
      // First complete it
      await testMilestone.update({ status: 'completed', completed_at: new Date() });

      // Then change to in_progress
      const response = await request(app)
        .put(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          status: 'in_progress'
        });

      expect(response.status).toBe(200);
      expect(response.body.milestone.completed_at).toBeNull();
    });

    it('should fail with empty name', async () => {
      const response = await request(app)
        .put(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          name: '   '
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('cannot be empty');
    });

    it('should fail with invalid status', async () => {
      const response = await request(app)
        .put(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`)
        .send({
          status: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid status');
    });

    it('should fail when other nonprofit tries to update', async () => {
      const response = await request(app)
        .put(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${otherNonprofitToken}`)
        .send({
          name: 'Unauthorized Update'
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Access denied');
    });

    it('should fail for researcher role', async () => {
      const response = await request(app)
        .put(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${researcherToken}`)
        .send({
          name: 'Researcher Update'
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Access denied');
    });
  });

  describe('DELETE /api/projects/:projectId/milestones/:id - Delete Milestone', () => {
    let testMilestone;

    beforeEach(async () => {
      testMilestone = await Milestone.create({
        project_id: testProject.project_id,
        name: 'To Delete',
        status: 'pending'
      });
    });

    it('should delete milestone successfully', async () => {
      const response = await request(app)
        .delete(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted successfully');
      expect(response.body.deleted_id).toBe(testMilestone.id);

      // Verify deletion
      const deleted = await Milestone.findByPk(testMilestone.id);
      expect(deleted).toBeNull();
    });

    it('should fail when other nonprofit tries to delete', async () => {
      const response = await request(app)
        .delete(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${otherNonprofitToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Access denied');
    });

    it('should fail for researcher role', async () => {
      const response = await request(app)
        .delete(`/api/projects/${testProject.project_id}/milestones/${testMilestone.id}`)
        .set('Authorization', `Bearer ${researcherToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Access denied');
    });

    it('should fail for non-existent milestone', async () => {
      const response = await request(app)
        .delete(`/api/projects/${testProject.project_id}/milestones/99999`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('GET /api/projects/:projectId/milestones/stats - Get Statistics', () => {
    beforeEach(async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const future = futureDate.toISOString().split('T')[0];

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const past = pastDate.toISOString().split('T')[0];

      await Milestone.create({
        project_id: testProject.project_id,
        name: 'Pending 1',
        status: 'pending',
        due_date: future
      });

      await Milestone.create({
        project_id: testProject.project_id,
        name: 'In Progress 1',
        status: 'in_progress',
        due_date: future
      });

      await Milestone.create({
        project_id: testProject.project_id,
        name: 'Completed 1',
        status: 'completed',
        completed_at: new Date()
      });

      await Milestone.create({
        project_id: testProject.project_id,
        name: 'Completed 2',
        status: 'completed',
        completed_at: new Date()
      });

      await Milestone.create({
        project_id: testProject.project_id,
        name: 'Overdue',
        status: 'in_progress',
        due_date: past
      });

      await Milestone.create({
        project_id: testProject.project_id,
        name: 'Cancelled',
        status: 'cancelled'
      });
    });

    it('should return accurate statistics', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject.project_id}/milestones/stats`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body.stats).toBeDefined();
      expect(response.body.stats.total).toBe(6);
      expect(response.body.stats.pending).toBe(1);
      expect(response.body.stats.in_progress).toBe(2);
      expect(response.body.stats.completed).toBe(2);
      expect(response.body.stats.cancelled).toBe(1);
      expect(response.body.stats.overdue).toBeGreaterThanOrEqual(1);
      expect(response.body.stats.completion_rate).toBe(33); // 2/6 = 33%
    });

    it('should show 0% completion rate with no milestones', async () => {
      // Create new project with no milestones
      const emptyProject = await Project.create({
        title: 'Empty Project',
        status: 'open',
        org_id: nonprofitOrg.id
      });

      const response = await request(app)
        .get(`/api/projects/${emptyProject.project_id}/milestones/stats`)
        .set('Authorization', `Bearer ${nonprofitToken}`);

      expect(response.status).toBe(200);
      expect(response.body.stats.total).toBe(0);
      expect(response.body.stats.completion_rate).toBe(0);
    });
  });

  describe('Authentication & Authorization', () => {
    it('should fail without token', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject.project_id}/milestones`);

      expect(response.status).toBe(401);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProject.project_id}/milestones`)
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });
  });
});
