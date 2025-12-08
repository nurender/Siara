const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  submitContact, 
  getAllContacts, 
  getContact, 
  updateContactStatus, 
  deleteContact 
} = require('../controllers/contactController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Validation
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('event_type').trim().notEmpty().withMessage('Event type is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
];

// Public route - Submit contact form
router.post('/', contactValidation, submitContact);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllContacts);
router.get('/:id', authMiddleware, adminMiddleware, getContact);
router.put('/:id', authMiddleware, adminMiddleware, updateContactStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteContact);

module.exports = router;

