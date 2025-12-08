const express = require('express');
const router = express.Router();
const { getStats, getRecentActivities } = require('../controllers/dashboardController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All routes protected for admin only
router.get('/stats', authMiddleware, adminMiddleware, getStats);
router.get('/activities', authMiddleware, adminMiddleware, getRecentActivities);

module.exports = router;

