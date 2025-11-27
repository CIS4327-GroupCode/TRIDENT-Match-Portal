const { ResearcherProfile } = require('../database/models');

/**
 * Get current user's researcher profile
 * GET /researchers/me
 */
const getResearcherProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Verify user is researcher
    if (req.user.role !== 'researcher') {
      return res.status(403).json({ error: 'Only researcher users can access researcher profile settings' });
    }

    const profile = await ResearcherProfile.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ error: 'Researcher profile not found' });
    }

    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Get researcher profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update current user's researcher profile
 * PUT /researchers/me
 */
const updateResearcherProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Verify user is researcher
    if (req.user.role !== 'researcher') {
      return res.status(403).json({ error: 'Only researcher users can update researcher profile settings' });
    }

    const allowedFields = [
      'title',
      'institution',
      'expertise',
      'research_interests',
      'bio',
      'projects_completed',
      'hourly_rate_min',
      'hourly_rate_max',
      'available_hours',
      'preferred_project_types'
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

    // Validate hourly rate range
    if (updates.hourly_rate_min !== undefined && updates.hourly_rate_max !== undefined) {
      if (updates.hourly_rate_min > updates.hourly_rate_max) {
        return res.status(400).json({ error: 'Minimum rate cannot exceed maximum rate' });
      }
    }

    const profile = await ResearcherProfile.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ error: 'Researcher profile not found' });
    }

    // Update profile
    await profile.update(updates);

    return res.status(200).json({ 
      message: 'Researcher profile updated successfully',
      profile 
    });
  } catch (error) {
    console.error('Update researcher profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getResearcherProfile,
  updateResearcherProfile
};
