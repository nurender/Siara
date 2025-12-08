const { pool } = require('../config/db');

// Submit contact form
const submitContact = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      event_type, 
      event_date, 
      guest_count, 
      budget, 
      venue_preference,
      message 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO contacts 
       (name, email, phone, event_type, event_date, guest_count, budget, venue_preference, message, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [name, email, phone, event_type, event_date || null, guest_count || null, budget || null, venue_preference || null, message]
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
};

// Get all contacts (Admin)
const getAllContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM contacts';
    let countQuery = 'SELECT COUNT(*) as total FROM contacts';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      countQuery += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [contacts] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, status ? [status] : []);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};

// Get single contact (Admin)
const getContact = async (req, res) => {
  try {
    const { id } = req.params;

    const [contacts] = await pool.query(
      'SELECT * FROM contacts WHERE id = ?',
      [id]
    );

    if (contacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contacts[0]
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact'
    });
  }
};

// Update contact status (Admin)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    await pool.query(
      'UPDATE contacts SET status = ?, admin_notes = ?, updated_at = NOW() WHERE id = ?',
      [status, notes || null, id]
    );

    res.json({
      success: true,
      message: 'Contact status updated successfully'
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
};

// Delete contact (Admin)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM contacts WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
};

module.exports = { 
  submitContact, 
  getAllContacts, 
  getContact, 
  updateContactStatus, 
  deleteContact 
};

