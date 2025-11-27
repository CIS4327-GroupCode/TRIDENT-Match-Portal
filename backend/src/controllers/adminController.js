const { User, Organization, ResearcherProfile, Project, Milestone, sequelize } = require('../database/models');
const bcrypt = require('bcrypt');

/**
 * Get dashboard statistics
 * GET /admin/dashboard/stats
 */
const getDashboardStats = async (req, res) => {
  try {
    const [stats] = await sequelize.query(`
      SELECT
        (SELECT COUNT(*) FROM _user WHERE deleted_at IS NULL) as total_users,
        (SELECT COUNT(*) FROM _user WHERE deleted_at IS NULL AND role = 'nonprofit') as nonprofit_users,
        (SELECT COUNT(*) FROM _user WHERE deleted_at IS NULL AND role = 'researcher') as researcher_users,
        (SELECT COUNT(*) FROM _user WHERE deleted_at IS NULL AND role = 'admin') as admin_users,
        (SELECT COUNT(*) FROM _user WHERE deleted_at IS NOT NULL) as suspended_users,
        (SELECT COUNT(*) FROM _user WHERE account_status = 'pending') as pending_approval,
        (SELECT COUNT(*) FROM organizations) as total_organizations,
        (SELECT COUNT(*) FROM project_ideas) as total_projects,
        (SELECT COUNT(*) FROM project_ideas WHERE status = 'open') as open_projects,
        (SELECT COUNT(*) FROM project_ideas WHERE status = 'draft') as draft_projects,
        (SELECT COUNT(*) FROM milestones) as total_milestones,
        (SELECT COUNT(*) FROM milestones WHERE status = 'pending') as pending_milestones,
        (SELECT COUNT(*) FROM milestones WHERE status = 'in_progress') as active_milestones,
        (SELECT COUNT(*) FROM milestones WHERE status = 'completed') as completed_milestones
    `);

    res.status(200).json({ stats: stats[0] });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

/**
 * Get all users with filtering and pagination
 * GET /admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role, 
      status, 
      search,
      includeSuspended = 'false'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    // Filter by role
    if (role && ['researcher', 'nonprofit', 'admin'].includes(role)) {
      where.role = role;
    }

    // Filter by account status
    if (status && ['active', 'pending', 'suspended'].includes(status)) {
      where.account_status = status;
    }

    // Search by name or email
    if (search) {
      where[sequelize.Op.or] = [
        { name: { [sequelize.Op.iLike]: `%${search}%` } },
        { email: { [sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    // Include or exclude suspended users
    const paranoid = includeSuspended === 'true' ? false : true;

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'role', 'account_status', 'mfa_enabled', 'created_at', 'updated_at', 'deleted_at'],
      include: [
        {
          model: ResearcherProfile,
          as: 'researcherProfile',
          attributes: ['affiliation', 'domains'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      paranoid
    });

    res.status(200).json({
      users,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/**
 * Get single user details
 * GET /admin/users/:id
 */
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: Organization,
          as: 'organization'
        },
        {
          model: ResearcherProfile,
          as: 'researcherProfile'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

/**
 * Update user account status
 * PUT /admin/users/:id/status
 */
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: active, pending, or suspended' });
    }

    const user = await User.findByPk(id, { paranoid: false });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.account_status = status;
    await user.save();

    res.status(200).json({ 
      message: `User status updated to ${status}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        account_status: user.account_status
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

/**
 * Suspend user account (soft delete)
 * POST /admin/users/:id/suspend
 */
const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot suspend admin accounts' });
    }

    // Soft delete the user
    await user.destroy();

    res.status(200).json({ 
      message: 'User account suspended successfully',
      reason: reason || 'No reason provided'
    });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ error: 'Failed to suspend user' });
  }
};

/**
 * Unsuspend user account (restore)
 * POST /admin/users/:id/unsuspend
 */
const unsuspendUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, { paranoid: false });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.deleted_at) {
      return res.status(400).json({ error: 'User account is not suspended' });
    }

    await user.restore();

    res.status(200).json({ 
      message: 'User account unsuspended successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Unsuspend user error:', error);
    res.status(500).json({ error: 'Failed to unsuspend user' });
  }
};

/**
 * Permanently delete user account
 * DELETE /admin/users/:id/permanent
 */
const permanentlyDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmation } = req.body;

    if (confirmation !== 'DELETE') {
      return res.status(400).json({ 
        error: 'Confirmation required. Send { "confirmation": "DELETE" } to proceed.' 
      });
    }

    const user = await User.findByPk(id, { paranoid: false });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin' && user.id === req.user.id) {
      return res.status(403).json({ error: 'Cannot delete your own admin account' });
    }

    const userName = user.name;
    const userEmail = user.email;

    await user.destroy({ force: true });

    res.status(200).json({ 
      message: `User "${userName}" (${userEmail}) permanently deleted. This action cannot be undone.`
    });
  } catch (error) {
    console.error('Permanently delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

/**
 * Approve pending user account
 * POST /admin/users/:id/approve
 */
const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.account_status !== 'pending') {
      return res.status(400).json({ error: 'User is not pending approval' });
    }

    user.account_status = 'active';
    await user.save();

    res.status(200).json({ 
      message: 'User account approved successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        account_status: user.account_status
      }
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ error: 'Failed to approve user' });
  }
};

/**
 * Get all projects with filtering
 * GET /admin/projects
 */
const getAllProjects = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      search 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (status && ['draft', 'open', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      where.status = status;
    }

    if (search) {
      where[sequelize.Op.or] = [
        { title: { [sequelize.Op.iLike]: `%${search}%` } },
        { problem: { [sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: projects } = await Project.findAndCountAll({
      where,
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      projects,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

/**
 * Delete project
 * DELETE /admin/projects/:id
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const projectTitle = project.title;
    await project.destroy();

    res.status(200).json({ 
      message: `Project "${projectTitle}" deleted successfully`,
      reason: reason || 'No reason provided'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

/**
 * Update project status
 * PUT /admin/projects/:id/status
 */
const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'open', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: draft, open, in_progress, completed, or cancelled' 
      });
    }

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.status = status;
    await project.save();

    res.status(200).json({ 
      message: `Project status updated to ${status}`,
      project: {
        project_id: project.project_id,
        title: project.title,
        status: project.status
      }
    });
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({ error: 'Failed to update project status' });
  }
};

/**
 * Get all milestones
 * GET /admin/milestones
 */
const getAllMilestones = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (status && ['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      where.status = status;
    }

    const { count, rows: milestones } = await Milestone.findAndCountAll({
      where,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['project_id', 'title'],
          include: [
            {
              model: Organization,
              as: 'organization',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['due_date', 'ASC']]
    });

    res.status(200).json({
      milestones,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all milestones error:', error);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
};

/**
 * Delete milestone
 * DELETE /admin/milestones/:id
 */
const deleteMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const milestone = await Milestone.findByPk(id);

    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    const milestoneName = milestone.name;
    await milestone.destroy();

    res.status(200).json({ 
      message: `Milestone "${milestoneName}" deleted successfully`,
      reason: reason || 'No reason provided'
    });
  } catch (error) {
    console.error('Delete milestone error:', error);
    res.status(500).json({ error: 'Failed to delete milestone' });
  }
};

/**
 * Get all organizations
 * GET /admin/organizations
 */
const getAllOrganizations = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (search) {
      where[sequelize.Op.or] = [
        { name: { [sequelize.Op.iLike]: `%${search}%` } },
        { EIN: { [sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: organizations } = await Organization.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      organizations,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all organizations error:', error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};

/**
 * Delete organization
 * DELETE /admin/organizations/:id
 */
const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmation } = req.body;

    if (confirmation !== 'DELETE') {
      return res.status(400).json({ 
        error: 'Confirmation required. Send { "confirmation": "DELETE" } to proceed. This will also delete all associated projects.' 
      });
    }

    const organization = await Organization.findByPk(id);

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const orgName = organization.name;
    await organization.destroy();

    res.status(200).json({ 
      message: `Organization "${orgName}" and all associated projects deleted successfully`
    });
  } catch (error) {
    console.error('Delete organization error:', error);
    res.status(500).json({ error: 'Failed to delete organization' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  suspendUser,
  unsuspendUser,
  permanentlyDeleteUser,
  approveUser,
  getAllProjects,
  deleteProject,
  updateProjectStatus,
  getAllMilestones,
  deleteMilestone,
  getAllOrganizations,
  deleteOrganization
};
