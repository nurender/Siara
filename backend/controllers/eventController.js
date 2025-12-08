const { pool } = require('../config/db');

// Create new event
const createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      event_type, 
      event_date, 
      venue, 
      city,
      guest_count,
      budget,
      client_id,
      status = 'planning'
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO events 
       (title, description, event_type, event_date, venue, city, guest_count, budget, client_id, status, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, event_type, event_date, venue, city, guest_count, budget, client_id, status, req.user.id]
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const { status, event_type, city, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT e.*, u.name as client_name FROM events e LEFT JOIN users u ON e.client_id = u.id WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM events WHERE 1=1';
    const params = [];
    const countParams = [];

    if (status) {
      query += ' AND e.status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }

    if (event_type) {
      query += ' AND e.event_type = ?';
      countQuery += ' AND event_type = ?';
      params.push(event_type);
      countParams.push(event_type);
    }

    if (city) {
      query += ' AND e.city = ?';
      countQuery += ' AND city = ?';
      params.push(city);
      countParams.push(city);
    }

    query += ' ORDER BY e.event_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [events] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: events,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
};

// Get single event
const getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const [events] = await pool.query(
      `SELECT e.*, u.name as client_name, u.email as client_email, u.phone as client_phone 
       FROM events e 
       LEFT JOIN users u ON e.client_id = u.id 
       WHERE e.id = ?`,
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: events[0]
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      event_type, 
      event_date, 
      venue, 
      city,
      guest_count,
      budget,
      status
    } = req.body;

    await pool.query(
      `UPDATE events SET 
       title = ?, description = ?, event_type = ?, event_date = ?, 
       venue = ?, city = ?, guest_count = ?, budget = ?, status = ?, 
       updated_at = NOW() 
       WHERE id = ?`,
      [title, description, event_type, event_date, venue, city, guest_count, budget, status, id]
    );

    res.json({
      success: true,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM events WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
};

// Get upcoming events
const getUpcomingEvents = async (req, res) => {
  try {
    const [events] = await pool.query(
      `SELECT * FROM events 
       WHERE event_date >= CURDATE() AND status != 'cancelled' 
       ORDER BY event_date ASC 
       LIMIT 10`
    );

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming events'
    });
  }
};

module.exports = { 
  createEvent, 
  getAllEvents, 
  getEvent, 
  updateEvent, 
  deleteEvent,
  getUpcomingEvents 
};

