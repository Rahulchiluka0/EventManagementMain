
import express from 'express';
import db from '../db/index.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const router = express.Router();

// Admin dashboard stats
router.get('/admin', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    // Total users by role
    const userStats = await db.query(`
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
    `);

    // Pending verifications
    const pendingUsers = await db.query(`
      SELECT COUNT(*) FROM users
      WHERE verification_status = 'pending' AND role != 'user'
    `);

    const pendingEvents = await db.query(`
      SELECT COUNT(*) FROM events
      WHERE verification_status = 'pending'
    `);

    // Revenue stats
    const revenueStats = await db.query(`
      SELECT 
        SUM(p.amount) as total_revenue,
        COUNT(p.id) as total_transactions,
        AVG(p.amount) as average_transaction
      FROM payments p
      WHERE p.status = 'completed'
    `);

    // Events stats
    const eventStats = await db.query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE start_date > NOW()) as upcoming_events,
        COUNT(*) FILTER (WHERE end_date < NOW()) as past_events
      FROM events
      WHERE verification_status = 'verified'
    `);

    // Recent transactions
    const recentTransactions = await db.query(`
      SELECT p.id, p.amount, p.payment_date, p.status,
             u.first_name || ' ' || u.last_name as user_name,
             CASE
               WHEN b.event_id IS NOT NULL THEN e.title
               WHEN b.stall_id IS NOT NULL THEN s.name
             END as item_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN users u ON b.user_id = u.id
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      ORDER BY p.payment_date DESC
      LIMIT 10
    `);

    res.json({
      userStats: userStats.rows,
      pendingVerifications: {
        users: parseInt(pendingUsers.rows[0].count),
        events: parseInt(pendingEvents.rows[0].count)
      },
      revenueStats: revenueStats.rows[0],
      eventStats: eventStats.rows[0],
      recentTransactions: recentTransactions.rows
    });
  } catch (error) {
    next(error);
  }
});

// Organizer dashboard stats
router.get('/organizer', authenticate, authorize('event_organizer'), async (req, res, next) => {
  try {
    // Ticket Event stats
    const ticketEventStats = await db.query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE verification_status = 'pending') as pending_events,
        COUNT(*) FILTER (WHERE verification_status = 'verified') as approved_events,
        COUNT(*) FILTER (WHERE start_date > NOW()) as upcoming_events,
        COUNT(*) FILTER (WHERE end_date < NOW()) as past_events,
        COUNT(*) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) as this_month_events
      FROM events
      WHERE organizer_id = $1
    `, [req.user.id]);

    // Stall Event stats
    const stallEventStats = await db.query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE verification_status = 'pending') as pending_events,
        COUNT(*) FILTER (WHERE verification_status = 'verified') as approved_events,
        COUNT(*) FILTER (WHERE start_date > NOW()) as upcoming_events,
        COUNT(*) FILTER (WHERE end_date < NOW()) as past_events,
        COUNT(*) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) as this_month_events
      FROM stall_events
      WHERE organizer_id = $1
    `, [req.user.id]);

    // Ticket Booking stats
    const ticketBookingStats = await db.query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE b.status = 'pending') as pending_bookings,
        COUNT(*) FILTER (WHERE b.status = 'confirmed') as confirmed_bookings,
        COUNT(*) FILTER (WHERE b.status = 'cancelled') as cancelled_bookings,
        COUNT(*) FILTER (WHERE b.status = 'confirmed' AND b.booking_date >= NOW() - INTERVAL '1 month') as last_month_confirmed_bookings
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = $1
    `, [req.user.id]);

    // Stall stats
    const stallStats = await db.query(`
      SELECT 
        COUNT(*) as total_stalls,
        COUNT(*) FILTER (WHERE s.is_available = true) as available_stalls,
        COUNT(*) FILTER (WHERE s.is_available = false) as booked_stalls,
        COUNT(*) FILTER (WHERE s.manager_id IS NOT NULL) as managed_stalls
      FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1
    `, [req.user.id]);

    // Stall Manager stats
    const managerStats = await db.query(`
      SELECT COUNT(DISTINCT s.manager_id) as total_managers
      FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND s.manager_id IS NOT NULL
    `, [req.user.id]);

    // Ticket Revenue stats
    const ticketRevenueStats = await db.query(`
      SELECT 
        COALESCE(SUM(p.amount), 0) as total_revenue,
        COUNT(p.id) as total_transactions,
        COALESCE(SUM(p.amount) FILTER (WHERE p.payment_date >= DATE_TRUNC('month', CURRENT_DATE)), 0) as this_month_revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = $1 AND p.status = 'completed'
    `, [req.user.id]);

    // Stall Revenue stats
    const stallRevenueStats = await db.query(`
      SELECT 
        COALESCE(SUM(p.amount), 0) as total_revenue,
        COUNT(p.id) as total_transactions,
        COALESCE(SUM(p.amount) FILTER (WHERE p.payment_date >= DATE_TRUNC('month', CURRENT_DATE)), 0) as this_month_revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND p.status = 'completed'
    `, [req.user.id]);

    // Recent ticket bookings
    const recentTicketBookings = await db.query(`
      SELECT b.id, b.booking_date, b.status, b.total_price,
             u.first_name || ' ' || u.last_name as user_name,
             e.title as event_title,
             'ticket' as booking_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = $1
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [req.user.id]);

    // Recent stall bookings
    const recentStallBookings = await db.query(`
      SELECT b.id, b.booking_date, b.status, b.total_price,
             u.first_name || ' ' || u.last_name as user_name,
             s.name as stall_name,
             se.title as event_title,
             'stall' as booking_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [req.user.id]);

    // Combine and sort recent bookings
    const allRecentBookings = [...recentTicketBookings.rows, ...recentStallBookings.rows]
      .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date))
      .slice(0, 5);

    // Monthly ticket revenue
    const monthlyTicketRevenue = await db.query(`
      SELECT 
        TO_CHAR(p.payment_date, 'YYYY-MM') as month,
        SUM(p.amount) as revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = $1 AND p.status = 'completed'
      AND p.payment_date >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month
    `, [req.user.id]);

    // Monthly stall revenue
    const monthlyStallRevenue = await db.query(`
      SELECT 
        TO_CHAR(p.payment_date, 'YYYY-MM') as month,
        SUM(p.amount) as revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND p.status = 'completed'
      AND p.payment_date >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month
    `, [req.user.id]);

    // Combine monthly revenue data
    const monthlyRevenue = {};

    monthlyTicketRevenue.rows.forEach(row => {
      if (!monthlyRevenue[row.month]) {
        monthlyRevenue[row.month] = { month: row.month, ticket_revenue: 0, stall_revenue: 0 };
      }
      monthlyRevenue[row.month].ticket_revenue = parseFloat(row.revenue);
    });

    monthlyStallRevenue.rows.forEach(row => {
      if (!monthlyRevenue[row.month]) {
        monthlyRevenue[row.month] = { month: row.month, ticket_revenue: 0, stall_revenue: 0 };
      }
      monthlyRevenue[row.month].stall_revenue = parseFloat(row.revenue);
    });

    const combinedMonthlyRevenue = Object.values(monthlyRevenue).map(item => ({
      ...item,
      total_revenue: item.ticket_revenue + item.stall_revenue
    }));

    // Pending stall requests
    const pendingRequests = await db.query(`
      SELECT COUNT(*) as count
      FROM stall_requests sr
      JOIN stalls s ON sr.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND sr.status = 'pending'
    `, [req.user.id]);

    res.json({
      eventStats: {
        ticketEvents: ticketEventStats.rows[0],
        stallEvents: stallEventStats.rows[0],
        total: {
          total_events: parseInt(ticketEventStats.rows[0].total_events) + parseInt(stallEventStats.rows[0].total_events),
          pending_events: parseInt(ticketEventStats.rows[0].pending_events) + parseInt(stallEventStats.rows[0].pending_events),
          approved_events: parseInt(ticketEventStats.rows[0].approved_events) + parseInt(stallEventStats.rows[0].approved_events),
          upcoming_events: parseInt(ticketEventStats.rows[0].upcoming_events) + parseInt(stallEventStats.rows[0].upcoming_events),
          past_events: parseInt(ticketEventStats.rows[0].past_events) + parseInt(stallEventStats.rows[0].past_events),
          this_month_events: parseInt(ticketEventStats.rows[0].this_month_events) + parseInt(stallEventStats.rows[0].this_month_events)
        }
      },
      bookingStats: ticketBookingStats.rows[0],
      stallStats: stallStats.rows[0],
      managerStats: managerStats.rows[0],
      revenueStats: {
        ticketEvents: ticketRevenueStats.rows[0],
        stallEvents: stallRevenueStats.rows[0],
        total: {
          total_revenue: parseFloat(ticketRevenueStats.rows[0].total_revenue) + parseFloat(stallRevenueStats.rows[0].total_revenue),
          total_transactions: parseInt(ticketRevenueStats.rows[0].total_transactions) + parseInt(stallRevenueStats.rows[0].total_transactions),
          this_month_revenue: parseFloat(ticketRevenueStats.rows[0].this_month_revenue) + parseFloat(stallRevenueStats.rows[0].this_month_revenue)
        }
      },
      recentBookings: allRecentBookings,
      monthlyRevenue: combinedMonthlyRevenue,
      pendingRequests: parseInt(pendingRequests.rows[0].count)
    });
  } catch (error) {
    next(error);
  }
});

// Stall organizer dashboard stats
router.get('/stall-organizer', authenticate, authorize('stall_organizer'), async (req, res, next) => {
  try {
    // Event stats
    const eventStats = await db.query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE verification_status = 'pending') as pending_events,
        COUNT(*) FILTER (WHERE verification_status = 'verified') as approved_events,
        COUNT(*) FILTER (WHERE start_date > NOW()) as upcoming_events,
        COUNT(*) FILTER (WHERE end_date < NOW()) as past_events
      FROM stall_events
      WHERE organizer_id = $1
    `, [req.user.id]);

    // Stall stats
    const stallStats = await db.query(`
      SELECT 
        COUNT(*) as total_stalls,
        COUNT(*) FILTER (WHERE s.is_available = true) as available_stalls,
        COUNT(*) FILTER (WHERE s.is_available = false) as booked_stalls,
        COUNT(*) FILTER (WHERE s.manager_id IS NOT NULL) as managed_stalls
      FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1
    `, [req.user.id]);

    // Manager stats
    const managerStats = await db.query(`
      SELECT COUNT(DISTINCT s.manager_id) as total_managers
      FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND s.manager_id IS NOT NULL
    `, [req.user.id]);

    // Revenue stats
    const revenueStats = await db.query(`
      SELECT 
        SUM(p.amount) as total_revenue,
        COUNT(p.id) as total_transactions
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1 AND p.status = 'completed'
    `, [req.user.id]);

    // Recent bookings
    const recentBookings = await db.query(`
      SELECT b.id, b.booking_date, b.status, b.total_price,
             u.first_name || ' ' || u.last_name as user_name,
             s.name as stall_name,
             se.title as event_title
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE se.organizer_id = $1
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [req.user.id]);

    res.json({
      eventStats: eventStats.rows[0],
      stallStats: stallStats.rows[0],
      managerStats: managerStats.rows[0],
      revenueStats: revenueStats.rows[0],
      recentBookings: recentBookings.rows
    });
  } catch (error) {
    next(error);
  }
});

// Stall manager dashboard stats
router.get('/stall-manager', authenticate, authorize('stall_manager'), async (req, res, next) => {
  try {
    // Stall stats
    const stallStats = await db.query(`
      SELECT 
        COUNT(*) as total_stalls,
        COUNT(*) FILTER (WHERE is_available = true) as available_stalls,
        COUNT(*) FILTER (WHERE is_available = false) as booked_stalls
      FROM stalls
      WHERE manager_id = $1
    `, [req.user.id]);

    // Booking stats
    const bookingStats = await db.query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE b.status = 'pending') as pending_bookings,
        COUNT(*) FILTER (WHERE b.status = 'confirmed') as confirmed_bookings,
        COUNT(*) FILTER (WHERE b.status = 'cancelled') as cancelled_bookings
      FROM bookings b
      JOIN stalls s ON b.stall_id = s.id
      WHERE s.manager_id = $1
    `, [req.user.id]);

    // Revenue stats
    const revenueStats = await db.query(`
      SELECT 
        SUM(p.amount) as total_revenue,
        COUNT(p.id) as total_transactions
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN stalls s ON b.stall_id = s.id
      WHERE s.manager_id = $1 AND p.status = 'completed'
    `, [req.user.id]);

    // Recent bookings
    const recentBookings = await db.query(`
      SELECT b.id, b.booking_date, b.status, b.total_price,
             u.first_name || ' ' || u.last_name as user_name,
             s.name as stall_name,
             se.title as event_title
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN stalls s ON b.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE s.manager_id = $1
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [req.user.id]);

    res.json({
      stallStats: stallStats.rows[0],
      bookingStats: bookingStats.rows[0],
      revenueStats: revenueStats.rows[0],
      recentBookings: recentBookings.rows
    });
  } catch (error) {
    next(error);
  }
});

// User dashboard stats
router.get('/user', authenticate, async (req, res, next) => {
  try {
    // Booking stats
    const bookingStats = await db.query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings
      FROM bookings
      WHERE user_id = $1
    `, [req.user.id]);

    // Total spent on bookings
    const totalSpent = await db.query(`
      SELECT COALESCE(SUM(p.amount), 0) as total_spent
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE b.user_id = $1 AND p.status = 'completed'
    `, [req.user.id]);

    // Upcoming events
    const upcomingEvents = await db.query(`
      SELECT b.id as booking_id, e.id as event_id, e.title, e.start_date, e.location, e.banner_image
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = $1
      AND b.status = 'confirmed'
      AND e.start_date > NOW()
      ORDER BY e.start_date
      LIMIT 5
    `, [req.user.id]);

    // Recent bookings
    const recentBookings = await db.query(`
      SELECT b.id, b.booking_date, b.status, b.total_price,
             CASE
               WHEN b.event_id IS NOT NULL THEN e.title
               WHEN b.stall_id IS NOT NULL THEN s.name
             END as item_name,
             p.status as payment_status
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      LEFT JOIN payments p ON p.booking_id = b.id
      WHERE b.user_id = $1
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [req.user.id]);

    // Unread notifications
    const unreadNotifications = await db.query(`
      SELECT COUNT(*) FROM notifications
      WHERE user_id = $1 AND is_read = false
    `, [req.user.id]);

    res.json({
      bookingStats: bookingStats.rows[0],
      totalSpent: parseFloat(totalSpent.rows[0].total_spent),
      upcomingEvents: upcomingEvents.rows,
      recentBookings: recentBookings.rows,
      unreadNotifications: parseInt(unreadNotifications.rows[0].count)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
