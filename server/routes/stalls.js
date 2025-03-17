
import express from 'express';
import db from '../db/index.js';
import { authenticate, authorize } from '../middleware/authenticate.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to validate uploads
const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,

});
// Get all stall events (public)
router.get('/events', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', startDate, endDate, location } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT se.*, u.first_name || ' ' || u.last_name as organizer_name,
             COUNT(s.id) as stall_count,
             COUNT(s.id) FILTER (WHERE s.is_available = true) as available_stall_count
      FROM stall_events se
      JOIN users u ON se.organizer_id = u.id
      LEFT JOIN stalls s ON se.id = s.stall_event_id
      WHERE se.is_published = true AND se.verification_status = 'verified'
    `;

    const queryParams = [];
    let paramPosition = 1;

    if (search) {
      query += ` AND (se.title ILIKE $${paramPosition} OR se.description ILIKE $${paramPosition})`;
      queryParams.push(`%${search}%`);
      paramPosition++;
    }

    if (startDate) {
      query += ` AND se.start_date >= $${paramPosition}`;
      queryParams.push(startDate);
      paramPosition++;
    }

    if (endDate) {
      query += ` AND se.end_date <= $${paramPosition}`;
      queryParams.push(endDate);
      paramPosition++;
    }

    if (location) {
      query += ` AND (se.city ILIKE $${paramPosition} OR se.country ILIKE $${paramPosition})`;
      queryParams.push(`%${location}%`);
      paramPosition++;
    }

    query += `
      GROUP BY se.id, u.first_name, u.last_name
      ORDER BY se.start_date ASC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;

    queryParams.push(parseInt(limit), offset);

    const result = await db.query(query, queryParams);

    // Count total for pagination
    const countQuery = `
      SELECT COUNT(*) FROM stall_events
      WHERE is_published = true AND verification_status = 'verified'
    `;

    let countParams = [];
    let countPosition = 1;

    if (search) {
      countQuery += ` AND (title ILIKE $${countPosition} OR description ILIKE $${countPosition})`;
      countParams.push(`%${search}%`);
      countPosition++;
    }

    if (startDate) {
      countQuery += ` AND start_date >= $${countPosition}`;
      countParams.push(startDate);
      countPosition++;
    }

    if (endDate) {
      countQuery += ` AND end_date <= $${countPosition}`;
      countParams.push(endDate);
      countPosition++;
    }

    if (location) {
      countQuery += ` AND (city ILIKE $${countPosition} OR country ILIKE $${countPosition})`;
      countParams.push(`%${location}%`);
      countPosition++;
    }

    const countResult = await db.query(countQuery, countParams);
    const totalEvents = parseInt(countResult.rows[0].count);

    res.json({
      stallEvents: result.rows,
      pagination: {
        total: totalEvents,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalEvents / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all stall events (event_organizer)
router.get('/myevents', authenticate, authorize('event_organizer'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    let query = `
      SELECT se.*, COUNT(s.id) as stall_count, COUNT(sr.id) as request_count
      FROM stall_events se
      LEFT JOIN stalls s ON se.id = s.stall_event_id
      LEFT JOIN stall_requests sr ON se.id = sr.stall_event_id
      WHERE se.organizer_id = $1 
    `;
    const queryParams = [req.user.id];
    let paramPosition = 2;
    if (status) {
      query += ` AND se.verification_status = $${paramPosition}`;
      queryParams.push(status);
      paramPosition++;
    }
    query += `
      GROUP BY se.id
      ORDER BY se.start_date DESC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;
    queryParams.push(parseInt(limit), offset);
    const result = await db.query(query, queryParams);
    // Count total for pagination
    const countQuery = `
      SELECT COUNT(*) FROM stall_events
      WHERE organizer_id = $1
    `;
    let countParams = [req.user.id];
    let countPosition = 2;
    if (status) {
      countQuery += ` AND verification_status = $${countPosition}`;
      countParams.push(status);
    }
    const countResult = await db.query(countQuery, countParams);
    const totalEvents = parseInt(countResult.rows[0].count);
    res.json({
      events: result.rows,
      pagination: {
        total: totalEvents,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalEvents / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});


// Get stall event by ID (for public)
router.get('/events/:id', async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Get event details
    const eventResult = await db.query(
      `SELECT se.*, u.first_name || ' ' || u.last_name as organizer_name
       FROM stall_events se
       JOIN users u ON se.organizer_id = u.id
       WHERE se.id = $1 AND (se.is_published = true OR $2 = true)`,
      [eventId, req.user ? true : false]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: 'Stall event not found' });
    }

    const event = eventResult.rows[0];

    // Get stalls for this event
    const stallsResult = await db.query(
      `SELECT * FROM stalls 
       WHERE stall_event_id = $1
       ORDER BY created_at ASC`,
      [eventId]
    );

    const eventWithStalls = {
      ...event,
      stalls: stallsResult.rows
    };

    res.json({ stallEvent: eventWithStalls });
  } catch (error) {
    next(error);
  }
});

// Get stall event by ID (for organizer)
router.get('/organiser/mystall-event/:id', authenticate, authorize('event_organizer', 'admin'), async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Get event details
    const eventResult = await db.query(
      `SELECT se.*, u.first_name || ' ' || u.last_name as organizer_name
       FROM stall_events se
       JOIN users u ON se.organizer_id = u.id
       WHERE se.id = $1`,
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: 'Stall event not found' });
    }

    const event = eventResult.rows[0];

    // Get stalls for this event
    const stallsResult = await db.query(
      `SELECT * FROM stalls 
       WHERE stall_event_id = $1
       ORDER BY created_at ASC`,
      [eventId]
    );

    const eventWithStalls = {
      ...event,
      stalls: stallsResult.rows
    };

    res.json({ stallEvent: eventWithStalls });
  } catch (error) {
    next(error);
  }
});

// Create stall event (event organizer only)
router.post('/events', authenticate, authorize('event_organizer', 'admin'), upload.single('bannerImage'), async (req, res, next) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Check if the organizer is verified
    const userResult = await client.query(
      'SELECT verification_status FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User  not found' });
    }

    const { verification_status } = userResult.rows[0];

    if (verification_status !== 'verified') {
      return res.status(403).json({
        message: 'Your account is not verified. You cannot create stall events.'
      });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      location,
      address,
      city,
      state,
      country,
      zipCode,
    } = req.body;

    // Get the uploaded banner image filename
    const bannerImage = req.file ? req.file.filename : null;

    // Validate required fields
    if (!title || !description || !startDate || !endDate || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Parse stalls from the request body
    let stalls = [];
    if (req.body.stalls) {
      try {
        stalls = JSON.parse(req.body.stalls); // Parse the JSON string into an array
      } catch (error) {
        return res.status(400).json({ message: 'Invalid stalls data' });
      }
    }

    // Insert stall event
    const eventResult = await client.query(
      `INSERT INTO stall_events (
        title, description, start_date, end_date,
        location, address, city, state, country, zip_code,
        banner_image, organizer_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        title, description, startDate, endDate,
        location, address, city, state, country, zipCode,
        bannerImage, req.user.id
      ]
    );

    const event = eventResult.rows[0];

    // Insert stalls into the database if any
    if (stalls.length > 0) {
      const stallInsertPromises = stalls.map(stall => {
        return client.query(
          `INSERT INTO stalls (stall_event_id, name, description, price, size, location_in_venue)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [event.id, stall.name, stall.description, stall.price, stall.size, stall.locationInVenue]
        );
      });

      // Wait for all stall inserts to complete
      await Promise.all(stallInsertPromises);
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Stall event created successfully and pending verification',
      stallEvent: event
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// Update stall event (stall organizer only)
router.put('/events/:id', authenticate, authorize('event_organizer', 'admin'), async (req, res, next) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const eventId = req.params.id;

    // Check if event exists and belongs to this organizer
    const eventCheck = await client.query(
      'SELECT * FROM stall_events WHERE id = $1 AND (organizer_id = $2 OR $3 = true)',
      [eventId, req.user.id, req.user.role === 'admin']
    );

    if (eventCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: 'Stall event not found or you are not authorized to edit it'
      });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      location,
      address,
      city,
      state,
      country,
      zipCode,
      bannerImage,
      isPublished
    } = req.body;

    // Update stall event
    const updateResult = await client.query(
      `UPDATE stall_events
       SET title = $1, description = $2, start_date = $3,
           end_date = $4, location = $5, address = $6,
           city = $7, state = $8, country = $9,
           zip_code = $10, banner_image = $11, is_published = $12,
           updated_at = NOW()
       WHERE id = $13
       RETURNING *`,
      [
        title, description, startDate,
        endDate, location, address,
        city, state, country,
        zipCode, bannerImage, isPublished,
        eventId
      ]
    );

    const updatedEvent = updateResult.rows[0];

    await client.query('COMMIT');

    res.json({
      message: 'Stall event updated successfully',
      stallEvent: updatedEvent
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// Delete stall event (stall organizer only)
router.delete('/events/:id', authenticate, authorize('event_organizer', 'admin'), async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Check if event exists and belongs to this organizer
    const eventCheck = await db.query(
      'SELECT * FROM stall_events WHERE id = $1 AND (organizer_id = $2 OR $3 = true)',
      [eventId, req.user.id, req.user.role === 'admin']
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        message: 'Stall event not found or you are not authorized to delete it'
      });
    }

    // Check if there are any bookings
    const bookingsCheck = await db.query(
      `SELECT COUNT(*) FROM bookings b
       JOIN stalls s ON b.stall_id = s.id
       WHERE s.stall_event_id = $1`,
      [eventId]
    );

    if (parseInt(bookingsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        message: 'Cannot delete stall event with active bookings. Cancel all bookings first.'
      });
    }

    // Delete stall event (cascade will delete related stalls)
    await db.query('DELETE FROM stall_events WHERE id = $1', [eventId]);

    res.json({ message: 'Stall event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get stalls by event
router.get('/events/:id/stalls', async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const { available = 'all' } = req.query;

    let query = `SELECT s.*, 
                      u.first_name || ' ' || u.last_name as manager_name
                FROM stalls s
                LEFT JOIN users u ON s.manager_id = u.id
                WHERE s.stall_event_id = $1`;

    const queryParams = [eventId];

    if (available === 'true') {
      query += ' AND s.is_available = true';
    } else if (available === 'false') {
      query += ' AND s.is_available = false';
    }

    query += ' ORDER BY s.created_at ASC';

    const result = await db.query(query, queryParams);

    res.json({
      stalls: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Create stall (stall organizer only)
router.post('/events/:id/stalls', authenticate, authorize('event_organizer', 'admin'), async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Check if event exists and belongs to this organizer
    const eventCheck = await db.query(
      'SELECT * FROM stall_events WHERE id = $1 AND (organizer_id = $2 OR $3 = true)',
      [eventId, req.user.id, req.user.role === 'admin']
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        message: 'Stall event not found or you are not authorized to add stalls to it'
      });
    }

    const { name, description, price, size, locationInVenue } = req.body;

    // Insert stall
    const result = await db.query(
      `INSERT INTO stalls (
        stall_event_id, name, description, price, size, location_in_venue
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [eventId, name, description, price, size, locationInVenue]
    );

    const stall = result.rows[0];

    res.status(201).json({
      message: 'Stall created successfully',
      stall
    });
  } catch (error) {
    next(error);
  }
});

// Get stall by ID
router.get('/:id', authenticate, authorize('stall_manager', 'event_organizer', 'admin'), async (req, res, next) => {
  try {
    const stallId = req.params.id;

    // Get stall details with event and organizer information
    const stallResult = await db.query(
      `SELECT s.*, 
              se.title as event_title, 
              se.description as event_description,
              se.start_date, 
              se.end_date, 
              se.location,
              se.address,
              se.city,
              se.state,
              se.country,
              se.zip_code,
              u.first_name || ' ' || u.last_name as organizer_name,
              u.email as organizer_email,
              u.phone as organizer_phone
       FROM stalls s
       JOIN stall_events se ON s.stall_event_id = se.id
       JOIN users u ON se.organizer_id = u.id
       WHERE s.id = $1`,
      [stallId]
    );

    if (stallResult.rows.length === 0) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    const stall = stallResult.rows[0];

    // Check if user is authorized to view this stall
    if (req.user.role === 'stall_manager' && stall.manager_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to view this stall' });
    }

    if (req.user.role === 'event_organizer') {
      // Get the organizer ID for this stall's event
      const organizerCheck = await db.query(
        'SELECT organizer_id FROM stall_events WHERE id = $1',
        [stall.stall_event_id]
      );

      if (organizerCheck.rows[0].organizer_id !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to view this stall' });
      }
    }

    // Get revenue and visitor data if available
    const statsResult = await db.query(
      `SELECT 
         COALESCE(SUM(b.stall_price), 0) as revenue,
         COUNT(DISTINCT b.user_id) as visitors
       FROM bookings b
       WHERE b.stall_id = $1 AND b.status = 'confirmed'`,
      [stallId]
    );


    const stats = statsResult.rows[0];

    const stallDetail = {
      ...stall,
      revenue: stats.revenue,
      visitors: parseInt(stats.visitors)
    };

    res.json({ stallDetail });
  } catch (error) {
    next(error);
  }
});

// Update stall (stall organizer only)
router.put('/stalls/:id', authenticate, authorize('event_organizer', 'admin'), async (req, res, next) => {
  try {
    const stallId = req.params.id;

    // Check if stall exists and belongs to an event organized by this user
    const stallCheck = await db.query(
      `SELECT s.* FROM stalls s
       JOIN stall_events se ON s.stall_event_id = se.id
       WHERE s.id = $1 AND (se.organizer_id = $2 OR $3 = true)`,
      [stallId, req.user.id, req.user.role === 'admin']
    );

    if (stallCheck.rows.length === 0) {
      return res.status(404).json({
        message: 'Stall not found or you are not authorized to edit it'
      });
    }

    const { name, description, price, size, locationInVenue, isAvailable } = req.body;

    // Update stall
    const result = await db.query(
      `UPDATE stalls
       SET name = $1, description = $2, price = $3,
           size = $4, location_in_venue = $5, is_available = $6,
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, description, price, size, locationInVenue, isAvailable, stallId]
    );

    const updatedStall = result.rows[0];

    res.json({
      message: 'Stall updated successfully',
      stall: updatedStall
    });
  } catch (error) {
    next(error);
  }
});

// Delete stall (stall organizer only)
router.delete('/stalls/:id', authenticate, authorize('event_organizer', 'admin'), async (req, res, next) => {
  try {
    const stallId = req.params.id;

    // Check if stall exists and belongs to an event organized by this user
    const stallCheck = await db.query(
      `SELECT s.* FROM stalls s
       JOIN stall_events se ON s.stall_event_id = se.id
       WHERE s.id = $1 AND (se.organizer_id = $2 OR $3 = true)`,
      [stallId, req.user.id, req.user.role === 'admin']
    );

    if (stallCheck.rows.length === 0) {
      return res.status(404).json({
        message: 'Stall not found or you are not authorized to delete it'
      });
    }

    // Check if there are any bookings
    const bookingsCheck = await db.query(
      'SELECT COUNT(*) FROM bookings WHERE stall_id = $1',
      [stallId]
    );

    if (parseInt(bookingsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        message: 'Cannot delete stall with active bookings. Cancel all bookings first.'
      });
    }

    // Delete stall
    await db.query('DELETE FROM stalls WHERE id = $1', [stallId]);

    res.json({ message: 'Stall deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get stall events pending verification (admin only)
router.get('/admin/pending', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT se.*, u.first_name || ' ' || u.last_name as organizer_name
      FROM stall_events se
      JOIN users u ON se.organizer_id = u.id
      WHERE se.verification_status = 'pending'
      ORDER BY se.created_at ASC
      LIMIT $1 OFFSET $2
    `;

    const result = await db.query(query, [parseInt(limit), offset]);

    // Count total pending
    const countResult = await db.query(
      'SELECT COUNT(*) FROM stall_events WHERE verification_status = $1',
      ['pending']
    );

    const totalPending = parseInt(countResult.rows[0].count);

    res.json({
      stallEvents: result.rows,
      pagination: {
        total: totalPending,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalPending / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});


// Admin routes for stall event verification
router.put('/events/verify/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const { status, feedbackMessage } = req.body;

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be verified or rejected' });
    }

    // Determine is_published value
    const isPublished = status === 'verified' ? true : false;

    // Update event status
    const result = await db.query(
      `UPDATE stall_events
       SET verification_status = $1, is_published = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, isPublished, eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Stall event not found' });
    }

    const event = result.rows[0];

    // Create notification for organizer
    const message = status === 'verified'
      ? `Your stall event "${event.title}" has been approved.`
      : `Your stall event "${event.title}" was not approved. ${feedbackMessage || ''}`;

    await db.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1, $2, $3)`,
      [event.organizer_id, `Stall Event ${status.charAt(0).toUpperCase() + status.slice(1)}`, message]
    );

    res.json({
      message: `Stall event ${status} successfully`,
      stallEvent: event
    });
  } catch (error) {
    next(error);
  }
});

// NEW ROUTES: STALL REQUEST MANAGEMENT

// 1. Stall manager applies for a stall
router.post('/requests', authenticate, authorize('stall_manager'), async (req, res, next) => {
  try {
    const { stallId, message } = req.body;

    if (!stallId) {
      return res.status(400).json({ message: 'Stall ID is required' });
    }

    // Check if stall exists and is available
    const stallCheck = await db.query(
      'SELECT * FROM stalls WHERE id = $1 AND is_available = true',
      [stallId]
    );

    if (stallCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Stall not found or is not available' });
    }

    // Check if there's already a pending request for this stall by this manager
    const existingRequest = await db.query(
      'SELECT * FROM stall_requests WHERE stall_id = $1 AND manager_id = $2 AND status = $3',
      [stallId, req.user.id, 'pending']
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({ message: 'You already have a pending request for this stall' });
    }

    // Create stall request
    const result = await db.query(
      `INSERT INTO stall_requests (stall_id, manager_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [stallId, req.user.id, message]
    );

    const request = result.rows[0];

    // Get stall event organizer info
    const organizerInfo = await db.query(
      `SELECT se.organizer_id, s.name as stall_name, se.title as event_title
       FROM stalls s
       JOIN stall_events se ON s.stall_event_id = se.id
       WHERE s.id = $1`,
      [stallId]
    );

    if (organizerInfo.rows.length > 0) {
      const { organizer_id, stall_name, event_title } = organizerInfo.rows[0];

      // Create notification for stall organizer
      await db.query(
        `INSERT INTO notifications (user_id, title, message)
         VALUES ($1, $2, $3)`,
        [
          organizer_id,
          'New Stall Request',
          `A stall manager has requested to manage "${stall_name}" in your event "${event_title}".`
        ]
      );
    }

    res.status(201).json({
      message: 'Stall request submitted successfully',
      request
    });
  } catch (error) {
    next(error);
  }
});

// 2. Get all requests for a stall manager
router.get('/requests/manager', authenticate, authorize('stall_manager'), async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT sr.*, s.name as stall_name, se.title as event_title,
             u.first_name || ' ' || u.last_name as organizer_name
      FROM stall_requests sr
      JOIN stalls s ON sr.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      JOIN users u ON se.organizer_id = u.id
      WHERE sr.manager_id = $1
    `;

    const queryParams = [req.user.id];
    let paramPosition = 2;

    if (status) {
      query += ` AND sr.status = $${paramPosition}`;
      queryParams.push(status);
    }

    query += ' ORDER BY sr.created_at DESC';

    const result = await db.query(query, queryParams);

    res.json({
      requests: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// 3. Get all requests for a stall organizer
router.get('/requests/organizer', authenticate, authorize('event_organizer'), async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT sr.*, s.name as stall_name, se.title as event_title,
             u.first_name || ' ' || u.last_name as manager_name
      FROM stall_requests sr
      JOIN stalls s ON sr.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
      JOIN users u ON sr.manager_id = u.id
      WHERE se.organizer_id = $1
    `;

    const queryParams = [req.user.id];
    let paramPosition = 2;

    if (status) {
      query += ` AND sr.status = $${paramPosition}`;
      queryParams.push(status);
    }

    query += ' ORDER BY sr.created_at DESC';

    const result = await db.query(query, queryParams);

    res.json({
      requests: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// 4. Stall organizer approves or rejects a request
router.put('/requests/:id', authenticate, authorize('event_organizer'), async (req, res, next) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const requestId = req.params.id;
    const { status, feedback } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved or rejected' });
    }

    // Check if request exists and belongs to a stall in an event organized by this user
    const requestCheck = await client.query(
      `SELECT sr.*, s.stall_event_id, s.name as stall_name, se.title as event_title
       FROM stall_requests sr
       JOIN stalls s ON sr.stall_id = s.id
       JOIN stall_events se ON s.stall_event_id = se.id
       WHERE sr.id = $1 AND se.organizer_id = $2 AND sr.status = 'pending'`,
      [requestId, req.user.id]
    );

    if (requestCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: 'Request not found, not pending, or you are not authorized to process it'
      });
    }

    const request = requestCheck.rows[0];

    // Update request status
    const updateResult = await client.query(
      `UPDATE stall_requests
       SET status = $1, feedback = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, feedback, requestId]
    );

    // If approved, assign manager to stall and make it unavailable
    if (status === 'approved') {
      await client.query(
        `UPDATE stalls
         SET manager_id = $1, is_available = false, updated_at = NOW()
         WHERE id = $2`,
        [request.manager_id, request.stall_id]
      );
    }

    // Create notification for stall manager
    const message = status === 'approved'
      ? `Your request to manage stall "${request.stall_name}" in event "${request.event_title}" has been approved.`
      : `Your request to manage stall "${request.stall_name}" in event "${request.event_title}" has been rejected. ${feedback || ''}`;

    await client.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1, $2, $3)`,
      [request.manager_id, `Stall Request ${status.charAt(0).toUpperCase() + status.slice(1)}`, message]
    );

    await client.query('COMMIT');

    res.json({
      message: `Stall request ${status} successfully`,
      request: updateResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// 5. Get all available stalls (for stall manager to request)
router.get('/available', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, eventId } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, se.title as event_title, se.start_date, se.end_date,
             se.city, se.country
      FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE s.is_available = true 
      AND s.manager_id IS NULL
      AND se.verification_status = 'verified'
      AND se.is_published = true
    `;

    const queryParams = [];
    let paramPosition = 1;

    if (eventId) {
      query += ` AND s.stall_event_id = $${paramPosition}`;
      queryParams.push(eventId);
      paramPosition++;
    }

    query += `
      ORDER BY se.start_date ASC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;

    queryParams.push(parseInt(limit), offset);

    const result = await db.query(query, queryParams);

    // Count total for pagination
    let countQuery = `
      SELECT COUNT(*) FROM stalls s
      JOIN stall_events se ON s.stall_event_id = se.id
      WHERE s.is_available = true 
      AND s.manager_id IS NULL
      AND se.verification_status = 'verified'
      AND se.is_published = true
    `;

    const countParams = [];
    let countPosition = 1;

    if (eventId) {
      countQuery += ` AND s.stall_event_id = $${countPosition}`;
      countParams.push(eventId);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalStalls = parseInt(countResult.rows[0].count);

    res.json({
      stalls: result.rows,
      pagination: {
        total: totalStalls,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalStalls / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// 6. Stall manager releases a stall
router.put('/release/:id', authenticate, authorize('stall_manager'), async (req, res, next) => {
  try {
    const stallId = req.params.id;

    // Check if stall exists and is managed by this user
    const stallCheck = await db.query(
      'SELECT * FROM stalls WHERE id = $1 AND manager_id = $2',
      [stallId, req.user.id]
    );

    if (stallCheck.rows.length === 0) {
      return res.status(404).json({
        message: 'Stall not found or you are not managing this stall'
      });
    }

    // Check if there are active bookings
    const bookingsCheck = await db.query(
      "SELECT COUNT(*) FROM bookings WHERE stall_id = $1 AND status = 'confirmed'",
      [stallId]
    );

    if (parseInt(bookingsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        message: 'Cannot release stall with active bookings. Cancel all bookings first.'
      });
    }

    // Release stall
    const result = await db.query(
      `UPDATE stalls
       SET manager_id = NULL, is_available = true, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [stallId]
    );

    const stall = result.rows[0];

    // Notify organizer
    const organizerInfo = await db.query(
      `SELECT se.organizer_id, s.name as stall_name, se.title as event_title
       FROM stalls s
       JOIN stall_events se ON s.stall_event_id = se.id
       WHERE s.id = $1`,
      [stallId]
    );

    if (organizerInfo.rows.length > 0) {
      const { organizer_id, stall_name, event_title } = organizerInfo.rows[0];

      await db.query(
        `INSERT INTO notifications (user_id, title, message)
         VALUES ($1, $2, $3)`,
        [
          organizer_id,
          'Stall Released',
          `A stall manager has released "${stall_name}" in your event "${event_title}".`
        ]
      );
    }

    res.json({
      message: 'Stall released successfully',
      stall
    });
  } catch (error) {
    next(error);
  }
});

export default router;
