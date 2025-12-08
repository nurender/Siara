const { pool } = require('../config/db');

// Get dashboard statistics
const getStats = async (req, res) => {
  try {
    // Total events
    const [eventsResult] = await pool.query('SELECT COUNT(*) as total FROM events');
    
    // Total bookings
    const [bookingsResult] = await pool.query('SELECT COUNT(*) as total FROM bookings');
    
    // Pending contacts
    const [contactsResult] = await pool.query(
      "SELECT COUNT(*) as total FROM contacts WHERE status = 'new'"
    );
    
    // Total revenue
    const [revenueResult] = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'confirmed'"
    );

    // Upcoming events count
    const [upcomingResult] = await pool.query(
      "SELECT COUNT(*) as total FROM events WHERE event_date >= CURDATE() AND status != 'cancelled'"
    );

    // Monthly bookings (last 6 months)
    const [monthlyBookings] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM bookings 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    // Event type distribution
    const [eventTypes] = await pool.query(`
      SELECT event_type, COUNT(*) as count 
      FROM events 
      GROUP BY event_type
    `);

    res.json({
      success: true,
      data: {
        totalEvents: eventsResult[0].total,
        totalBookings: bookingsResult[0].total,
        pendingContacts: contactsResult[0].total,
        totalRevenue: revenueResult[0].total,
        upcomingEvents: upcomingResult[0].total,
        monthlyBookings,
        eventTypes
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get recent activities
const getRecentActivities = async (req, res) => {
  try {
    // Recent contacts
    const [recentContacts] = await pool.query(`
      SELECT id, name, email, event_type, status, created_at, 'contact' as type 
      FROM contacts 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // Recent bookings
    const [recentBookings] = await pool.query(`
      SELECT id, client_name, event_type, status, total_amount, created_at, 'booking' as type 
      FROM bookings 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // Combine and sort
    const activities = [...recentContacts, ...recentBookings]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities'
    });
  }
};

module.exports = { getStats, getRecentActivities };

