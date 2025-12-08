const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  createBooking, 
  getAllBookings, 
  getBooking, 
  updateBooking, 
  deleteBooking 
} = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Validation
const bookingValidation = [
  body('client_name').trim().notEmpty().withMessage('Client name is required'),
  body('client_email').isEmail().withMessage('Valid email is required'),
  body('client_phone').trim().notEmpty().withMessage('Phone is required'),
  body('event_type').trim().notEmpty().withMessage('Event type is required'),
  body('event_date').notEmpty().withMessage('Event date is required')
];

// Routes
router.post('/', bookingValidation, createBooking); // Public - for website booking form
router.get('/', authMiddleware, adminMiddleware, getAllBookings);
router.get('/:id', authMiddleware, adminMiddleware, getBooking);
router.put('/:id', authMiddleware, adminMiddleware, updateBooking);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBooking);

module.exports = router;

