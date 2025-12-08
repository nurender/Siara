const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  createEvent, 
  getAllEvents, 
  getEvent, 
  updateEvent, 
  deleteEvent,
  getUpcomingEvents 
} = require('../controllers/eventController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Validation
const eventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('event_type').trim().notEmpty().withMessage('Event type is required'),
  body('event_date').notEmpty().withMessage('Event date is required')
];

// Routes (all protected)
router.get('/upcoming', authMiddleware, getUpcomingEvents);
router.get('/', authMiddleware, getAllEvents);
router.get('/:id', authMiddleware, getEvent);
router.post('/', authMiddleware, adminMiddleware, eventValidation, createEvent);
router.put('/:id', authMiddleware, adminMiddleware, updateEvent);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;

