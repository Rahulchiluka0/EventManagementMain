
import express from 'express';
import db from '../db/index.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Process payment for a booking
router.post('/process/:bookingId', authenticate, async (req, res, next) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const { bookingId } = req.params;
    const { paymentMethod, transactionId } = req.body;

    // Get booking
    const bookingResult = await client.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [bookingId, req.user.id]
    );

    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    const booking = bookingResult.rows[0];

    if (booking.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }

    // Check for existing payment
    const existingPaymentResult = await client.query(
      'SELECT * FROM payments WHERE booking_id = $1',
      [bookingId]
    );

    if (existingPaymentResult.rows.length > 0) {
      const existingPayment = existingPaymentResult.rows[0];
      if (existingPayment.status === 'completed') {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'Payment already completed for this booking' });
      }
    }

    // Simulate a successful payment
    let paymentResult;
    if (existingPaymentResult.rows.length > 0) {
      paymentResult = await client.query(
        `UPDATE payments
         SET amount = $1, payment_date = NOW(), payment_method = $2,
             transaction_id = $3, status = 'completed', updated_at = NOW()
         WHERE booking_id = $4
         RETURNING *`,
        [booking.total_price, paymentMethod, transactionId || 'SIMULATED', bookingId]
      );
    } else {
      paymentResult = await client.query(
        `INSERT INTO payments (booking_id, user_id, amount, payment_method, transaction_id, status)
         VALUES ($1, $2, $3, $4, $5, 'completed')
         RETURNING *`,
        [bookingId, req.user.id, booking.total_price, paymentMethod, transactionId || 'SIMULATED']
      );
    }

    const payment = paymentResult.rows[0];

    // Update booking status
    await client.query(
      `UPDATE bookings SET status = 'confirmed', updated_at = NOW() WHERE id = $1`,
      [bookingId]
    );

    // Create notification for user
    await client.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1, $2, $3)`,
      [
        req.user.id,
        'Payment Successful',
        `Your payment of $${booking.total_price} for booking #${bookingId.substring(0, 8)} has been processed successfully.`
      ]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Payment processed successfully',
      payment,
      redirectUrl: `/confirmation/${bookingId}`
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// Get payment details
router.get('/:paymentId', authenticate, async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    const query = `
      SELECT p.*, b.user_id, b.total_price, b.event_id, b.stall_id, b.quantity,
             e.title as event_title, s.name as stall_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      WHERE p.id = $1 AND (b.user_id = $2 OR $3 = true)
    `;

    const result = await db.query(query, [
      paymentId,
      req.user.id,
      req.user.role === 'admin'
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found or unauthorized' });
    }

    res.json({ payment: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get payment status for a booking
router.get('/booking/:bookingId', authenticate, async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const query = `
      SELECT p.*, b.user_id, b.status as booking_status
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE p.booking_id = $1 AND (b.user_id = $2 OR $3 = true)
    `;

    const result = await db.query(query, [
      bookingId,
      req.user.id,
      req.user.role === 'admin'
    ]);

    if (result.rows.length === 0) {
      // Check if booking exists but no payment yet
      const bookingCheck = await db.query(
        'SELECT * FROM bookings WHERE id = $1 AND (user_id = $2 OR $3 = true)',
        [bookingId, req.user.id, req.user.role === 'admin']
      );

      if (bookingCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Booking not found or unauthorized' });
      }

      return res.json({
        payment: null,
        booking: bookingCheck.rows[0],
        message: 'No payment record found for this booking'
      });
    }

    res.json({ payment: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
