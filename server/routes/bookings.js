
import express from 'express';
import db from '../db/index.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const router = express.Router();

// Create a booking
router.post('/', authenticate, async (req, res, next) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const { eventId, stallId, quantity = 1, notes } = req.body;

    if (!eventId && !stallId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Either eventId or stallId must be provided' });
    }

    if (eventId && stallId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cannot book both event and stall at the same time' });
    }

    let bookingType, itemId, price, totalPrice, availabilityCheck;

    if (eventId) {
      // Check if event exists and is published/verified
      const eventResult = await client.query(
        `SELECT * FROM events
         WHERE id = $1 AND is_published = true AND verification_status = 'verified'`,
        [eventId]
      );

      if (eventResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Event not found or not available for booking' });
      }

      const event = eventResult.rows[0];

      // Check if event capacity is available
      if (event.max_capacity !== null && event.current_capacity + quantity > event.max_capacity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'Not enough capacity available for this event' });
      }

      bookingType = 'event';
      itemId = eventId;
      price = event.price;
      totalPrice = price * quantity;

      // Update event capacity
      await client.query(
        `UPDATE events SET current_capacity = current_capacity + $1 WHERE id = $2`,
        [quantity, eventId]
      );
    } else {
      // Check if stall exists and is available
      const stallResult = await client.query(
        'SELECT * FROM stalls WHERE id = $1 AND is_available = true',
        [stallId]
      );

      if (stallResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Stall not found or not available for booking' });
      }

      const stall = stallResult.rows[0];

      bookingType = 'stall';
      itemId = stallId;
      price = stall.price;
      totalPrice = price * quantity;

      // Mark stall as not available
      await client.query(
        'UPDATE stalls SET is_available = false WHERE id = $1',
        [stallId]
      );
    }

    // Create booking
    const bookingResult = await client.query(
      `INSERT INTO bookings (
        user_id, ${bookingType}_id, quantity, total_price, notes, status
      )
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *`,
      [req.user.id, itemId, quantity, totalPrice, notes]
    );

    const booking = bookingResult.rows[0];

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
      paymentUrl: `/payment/${booking.id}`
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// Get user's bookings
router.get('/my-bookings', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, 
             e.title as event_title, e.start_date as event_date, e.banner_image as event_image,
             s.name as stall_name, se.title as stall_event_title
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      LEFT JOIN stall_events se ON s.stall_event_id = se.id
      WHERE b.user_id = $1
    `;

    const queryParams = [req.user.id];
    let paramPosition = 2;

    if (status) {
      query += ` AND b.status = $${paramPosition}`;
      queryParams.push(status);
      paramPosition++;
    }

    query += `
      ORDER BY b.booking_date DESC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;

    queryParams.push(parseInt(limit), offset);

    const result = await db.query(query, queryParams);

    // Count total for pagination
    let countQuery = `
      SELECT COUNT(*) FROM bookings WHERE user_id = $1
    `;

    let countParams = [req.user.id];
    let countPosition = 2;

    if (status) {
      countQuery += ` AND status = $${countPosition}`;
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalBookings = parseInt(countResult.rows[0].count);

    res.json({
      bookings: result.rows,
      pagination: {
        total: totalBookings,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalBookings / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get booking by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    const query = `
      SELECT b.*, 
             e.title as event_title, e.description as event_description, 
             e.start_date as event_start_date, e.end_date as event_end_date,
             e.location as event_location, e.banner_image as event_image,
             s.name as stall_name, s.description as stall_description,
             se.title as stall_event_title, se.location as stall_event_location,
             p.id as payment_id, p.status as payment_status
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      LEFT JOIN stall_events se ON s.stall_event_id = se.id
      LEFT JOIN payments p ON p.booking_id = b.id
      WHERE b.id = $1 AND (b.user_id = $2 OR $3 = true OR 
            (e.organizer_id = $2) OR 
            (se.organizer_id = $2) OR 
            (s.manager_id = $2))
    `;

    const result = await db.query(query, [
      bookingId,
      req.user.id,
      ['admin', 'event_organizer'].includes(req.user.role)
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    res.json({ booking: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Cancel booking
router.put('/:id/cancel', authenticate, async (req, res, next) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const bookingId = req.params.id;

    // Get booking details
    const bookingResult = await client.query(
      `SELECT * FROM bookings
       WHERE id = $1 AND (user_id = $2 OR $3 = true)`,
      [bookingId, req.user.id, req.user.role === 'admin']
    );

    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    const booking = bookingResult.rows[0];

    if (booking.status === 'cancelled') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }

    // Update booking status
    const updateResult = await client.query(
      `UPDATE bookings
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [bookingId]
    );

    const updatedBooking = updateResult.rows[0];

    // If it's an event booking, update event capacity
    if (booking.event_id) {
      await client.query(
        `UPDATE events
         SET current_capacity = GREATEST(current_capacity - $1, 0)
         WHERE id = $2`,
        [booking.quantity, booking.event_id]
      );
    }

    // If it's a stall booking, mark stall as available again
    if (booking.stall_id) {
      await client.query(
        `UPDATE stalls
         SET is_available = true
         WHERE id = $1`,
        [booking.stall_id]
      );
    }

    // Check for payment and handle refund logic if needed
    const paymentResult = await client.query(
      `SELECT * FROM payments WHERE booking_id = $1 AND status = 'completed'`,
      [bookingId]
    );

    if (paymentResult.rows.length > 0) {
      // In a real application, this would initiate a refund process with payment provider
      await client.query(
        `UPDATE payments
         SET status = 'refunded', updated_at = NOW()
         WHERE booking_id = $1`,
        [bookingId]
      );
    }

    await client.query('COMMIT');

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// Get bookings for events organized by the current organizer
router.get('/organizer', authenticate, authorize('event_organizer'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, e.title as event_title, u.first_name || ' ' || u.last_name as customer_name
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN users u ON b.user_id = u.id
      WHERE e.organizer_id = $1
    `;

    const queryParams = [req.user.id];
    let paramPosition = 2;

    if (status) {
      query += ` AND b.status = $${paramPosition}`;
      queryParams.push(status);
      paramPosition++;
    }

    query += `
      ORDER BY b.created_at DESC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;

    queryParams.push(parseInt(limit), offset);

    const result = await db.query(query, queryParams);

    // Count total for pagination
    let countQuery = `
      SELECT COUNT(*) 
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = $1
    `;

    let countParams = [req.user.id];

    if (status) {
      countQuery += ` AND b.status = $2`;
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalBookings = parseInt(countResult.rows[0].count);

    res.json({
      bookings: result.rows,
      pagination: {
        total: totalBookings,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalBookings / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});


// Get bookings for an event (organizer only)
router.get('/event/:eventId', authenticate, authorize('organizer', 'admin'), async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    // Check if user is authorized to view these bookings
    const eventCheck = await db.query(
      'SELECT * FROM events WHERE id = $1 AND (organizer_id = $2 OR $3 = true)',
      [eventId, req.user.id, req.user.role === 'admin']
    );

    if (eventCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to view bookings for this event' });
    }

    let query = `
      SELECT b.*, u.first_name || ' ' || u.last_name as user_name, u.email as user_email,
             p.status as payment_status
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      LEFT JOIN payments p ON p.booking_id = b.id
      WHERE b.event_id = $1
    `;

    const queryParams = [eventId];
    let paramPosition = 2;

    if (status) {
      query += ` AND b.status = $${paramPosition}`;
      queryParams.push(status);
      paramPosition++;
    }

    query += `
      ORDER BY b.booking_date DESC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;

    queryParams.push(parseInt(limit), offset);

    const result = await db.query(query, queryParams);

    // Count total for pagination
    let countQuery = `
      SELECT COUNT(*) FROM bookings WHERE event_id = $1
    `;

    let countParams = [eventId];
    let countPosition = 2;

    if (status) {
      countQuery += ` AND status = $${countPosition}`;
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalBookings = parseInt(countResult.rows[0].count);

    res.json({
      bookings: result.rows,
      pagination: {
        total: totalBookings,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalBookings / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Validate ticket by QR code
router.post('/validate-ticket/:id', async (req, res, next) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const ticketId = req.params.id;

    // Check if the booking exists and get its current status
    const bookingResult = await client.query(
      `SELECT b.*, 
              e.title as event_title, 
              u.first_name || ' ' || u.last_name as attendee_name
       FROM bookings b
       LEFT JOIN events e ON b.event_id = e.id
       LEFT JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [ticketId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const booking = bookingResult.rows[0];

    // Check if booking is already used
    if (booking.is_used === true) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Ticket has already been used',
        ticket: {
          id: booking.id,
          eventTitle: booking.event_title,
          attendeeName: booking.attendee_name,
          isUsed: true,
          scannedAt: booking.scanned_at
        }
      });
    }

    // Check if booking status is confirmed
    if (booking.status !== 'confirmed') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `Ticket is not valid. Current status: ${booking.status}`,
        ticket: {
          id: booking.id,
          eventTitle: booking.event_title,
          attendeeName: booking.attendee_name,
          status: booking.status
        }
      });
    }

    // Mark the ticket as used
    const updateResult = await client.query(
      `UPDATE bookings 
       SET is_used = true, 
           scanned_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [ticketId]
    );

    const updatedBooking = updateResult.rows[0];

    await client.query('COMMIT');

    // Return success response
    res.json({
      success: true,
      message: 'Ticket validated successfully',
      ticket: {
        id: updatedBooking.id,
        eventTitle: booking.event_title,
        attendeeName: booking.attendee_name,
        isUsed: true,
        scannedAt: updatedBooking.scanned_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Ticket validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating ticket',
      error: error.message
    });
  } finally {
    client.release();
  }
});

export default router;
