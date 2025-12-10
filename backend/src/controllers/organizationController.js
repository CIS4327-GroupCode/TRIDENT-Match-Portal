const { Organization } = require('../database/models');

/**
 * Get current user's organization
 * GET /organizations/me
 */
const getOrganization = async (req, res) => {
  try {
    const userId = req.user.id;

    // Verify user is nonprofit
    if (req.user.role !== 'nonprofit') {
      return res.status(403).json({ error: 'Only nonprofit users can access organization settings' });
    }

    const organization = await Organization.findOne({ where: { user_id: userId } });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    return res.status(200).json({ organization });
  } catch (error) {
    console.error('Get organization error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update current user's organization
 * PUT /organizations/me
 */
const updateOrganization = async (req, res) => {
  try {
    const userId = req.user.id;

    // Verify user is nonprofit
    if (req.user.role !== 'nonprofit') {
      return res.status(403).json({ error: 'Only nonprofit users can update organization settings' });
    }

    const allowedFields = [
      'name',
      'EIN',
      'mission',
      'focus_tags',
      'compliance_flags',
      'contacts'
    ];

    // Filter only allowed fields from request body
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid update fields provided' });
    }

    const organization = await Organization.findOne({ where: { user_id: userId } });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Update organization
    await organization.update(updates);

    return res.status(200).json({ 
      message: 'Organization updated successfully',
      organization 
    });
  } catch (error) {
    console.error('Update organization error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getOrganization,
  updateOrganization
};
