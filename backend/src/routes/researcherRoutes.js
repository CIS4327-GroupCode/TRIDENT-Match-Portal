const express = require('express');
const router = express.Router();
const researcherController = require('../controllers/researcherController');
const { authenticate, requireResearcher } = require('../middleware/auth');

// All routes require authentication and researcher role
router.use(authenticate);
router.use(requireResearcher);

// Researcher profile settings routes
router.get('/me', researcherController.getResearcherProfile);
router.put('/me', researcherController.updateResearcherProfile);

module.exports = router;
