const { pool } = require('../config/db');

// Create new booking
const createBooking = async (req, res) => {
  try {
    const { 
      event_id,
      client_name,
      client_email,
      client_phone,
      event_type,
      event_date,
      venue,
      guest_count,
      package_type,
      total_amount,
      advance_amount,
      special_requests
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO bookings 
       (event_id, client_name, client_email, client_phone, event_type, event_date, venue, 
        guest_count, package_type, total_amount, advance_amount, special_requests, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [event_id || null, client_name, client_email, client_phone, event_type, event_date, 
       venue, guest_count, package_type, total_amount, advance_amount || 0, special_requests || null]
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { 
        id: result.insertId,
        booking_reference: `SIA-${Date.now().toString(36).toUpperCase()}`
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM bookings';
    let countQuery = 'SELECT COUNT(*) as total FROM bookings';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      countQuery += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [bookings] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, status ? [status] : []);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

// Get single booking
const getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const [bookings] = await pool.query(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: bookings[0]
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
};

// Update booking
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, total_amount, advance_amount, payment_status, notes } = req.body;

    await pool.query(
      `UPDATE bookings SET 
       status = COALESCE(?, status),
       total_amount = COALESCE(?, total_amount),
       advance_amount = COALESCE(?, advance_amount),
       payment_status = COALESCE(?, payment_status),
       admin_notes = COALESCE(?, admin_notes),
       updated_at = NOW() 
       WHERE id = ?`,
      [status, total_amount, advance_amount, payment_status, notes, id]
    );

    res.json({
      success: true,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking'
    });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking'
    });
  }
};

module.exports = { 
  createBooking, 
  getAllBookings, 
  getBooking, 
  updateBooking, 
  deleteBooking 
};

