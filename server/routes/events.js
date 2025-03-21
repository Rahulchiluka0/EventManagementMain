
import express from 'express';
import db from '../db/index.js';
import { authenticate, authorize } from '../middleware/authenticate.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
// const upload = multer({ dest: 'uploads/' }); // Set the destination for uploaded files

//  Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
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

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // limits: {
  //   fileSize: 5 * 1024 * 1024 // 5MB file size limit
  // }
});

// Get all published events (public)
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      type,
      startDate,
      endDate,
      location
    } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name,
      COUNT(ei.id) as image_count,
      EXISTS(SELECT 1 FROM stalls s WHERE s.event_id = e.id) as has_stalls
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      LEFT JOIN event_images ei ON e.id = ei.event_id
      WHERE e.is_published = true AND e.verification_status = 'verified'
    `;

    const queryParams = [];
    let paramPosition = 1;

    if (search) {
      query += ` AND (e.title ILIKE $${paramPosition} OR e.description ILIKE $${paramPosition})`;
      queryParams.push(`%${search}%`);
      paramPosition++;
    }

    if (type) {
      query += ` AND e.event_type = $${paramPosition}`;
      queryParams.push(type);
      paramPosition++;
    }

    if (startDate) {
      query += ` AND e.start_date >= $${paramPosition}`;
      queryParams.push(startDate);
      paramPosition++;
    }

    if (endDate) {
      query += ` AND e.end_date <= $${paramPosition}`;
      queryParams.push(endDate);
      paramPosition++;
    }

    if (location) {
      query += ` AND (e.city ILIKE $${paramPosition} OR e.country ILIKE $${paramPosition})`;
      queryParams.push(`%${location}%`);
      paramPosition++;
    }

    query += `
      GROUP BY e.id, u.first_name, u.last_name
      ORDER BY e.start_date ASC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;

    queryParams.push(parseInt(limit), offset);

    // Execute query
    const result = await db.query(query, queryParams);

    // Count total for pagination
    let countQuery = `
      SELECT COUNT(*) FROM events e
      WHERE e.is_published = true AND e.verification_status = 'verified'
    `;

    let countParams = [];
    let countPosition = 1;

    if (search) {
      countQuery += ` AND (e.title ILIKE $${countPosition} OR e.description ILIKE $${countPosition})`;
      countParams.push(`%${search}%`);
      countPosition++;
    }

    if (type) {
      countQuery += ` AND e.event_type = $${countPosition}`;
      countParams.push(type);
      countPosition++;
    }

    if (startDate) {
      countQuery += ` AND e.start_date >= $${countPosition}`;
      countParams.push(startDate);
      countPosition++;
    }

    if (endDate) {
      countQuery += ` AND e.end_date <= $${countPosition}`;
      countParams.push(endDate);
      countPosition++;
    }

    if (location) {
      countQuery += ` AND (e.city ILIKE $${countPosition} OR e.country ILIKE $${countPosition})`;
      countParams.push(`%${location}%`);
      countPosition++;
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

// Get single event by ID (public)
router.get('/:id', async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Get event details
    const eventResult = await db.query(
      `SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1 AND (e.is_published = true OR $2 = true)`,
      [eventId, req.user ? true : false]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = eventResult.rows[0];

    // Get event images
    const imagesResult = await db.query(
      'SELECT id, image_url FROM event_images WHERE event_id = $1',
      [eventId]
    );

    // Get stalls associated with this event
    const stallsResult = await db.query(
      'SELECT * FROM stalls WHERE event_id = $1',
      [eventId]
    );

    const eventWithImages = {
      ...event,
      images: imagesResult.rows,
      stalls: stallsResult.rows
    };

    res.json({ event: eventWithImages });
  } catch (error) {
    next(error);
  }
});

// Get single event by ID (for organizer)
router.get('/organiser/myevents/:id', authenticate, authorize('event_organizer', 'admin'), async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Get event details
    const eventResult = await db.query(
      `SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1 AND (e.organizer_id = $2 OR $3 = true)`,
      [eventId, req.user.id, req.user.role === 'admin']
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found or you do not have permission to view it' });
    }

    const event = eventResult.rows[0];

    // Get event images
    const imagesResult = await db.query(
      'SELECT * FROM event_images WHERE event_id = $1',
      [eventId]
    );

    // Get event statistics
    const statsResult = await db.query(
      `SELECT 
         COUNT(b.id) as total_bookings,
         COALESCE(SUM(b.quantity), 0) as total_tickets_sold,
         COALESCE(SUM(b.total_price), 0) as total_revenue,
         COUNT(DISTINCT b.user_id) as unique_attendees
       FROM bookings b
       WHERE b.event_id = $1 AND b.status = 'confirmed'`,
      [eventId]
    );

    // Get stalls for this event if any
    const stallsResult = await db.query(
      `SELECT * FROM stalls 
       WHERE event_id = $1
       ORDER BY created_at ASC`,
      [eventId]
    );

    // Format the response
    const eventWithDetails = {
      ...event,
      images: imagesResult.rows,
      stalls: stallsResult.rows,
      stats: {
        totalBookings: parseInt(statsResult.rows[0].total_bookings),
        totalTicketSold: parseInt(statsResult.rows[0].total_tickets_sold),
        totalRevenue: parseFloat(statsResult.rows[0].total_revenue),
        uniqueAttendees: parseInt(statsResult.rows[0].unique_attendees)
      }
    };

    res.json({ event: eventWithDetails });
  } catch (error) {
    next(error);
  }
});

// Create new event (organizer only)
router.post('/',
  authenticate,
  authorize('event_organizer', 'admin'),
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  async (req, res, next) => {
    // Log request details for debugging
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    // Verify files were uploaded
    if (!req.files || !req.files['bannerImage']) {
      return res.status(400).json({ message: 'Banner image is required' });
    }
    console.log('Full Path:', req.files['bannerImage'][0].path);


    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // Fetch the organizer's verification status
      const userResult = await client.query(
        'SELECT verification_status FROM users WHERE id = $1',
        [req.user.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { verification_status } = userResult.rows[0];

      // Check if the organizer is verified
      if (verification_status !== 'verified') {
        return res.status(403).json({ message: 'Your account is not verified. You cannot create events.' });
      }

      // Parse and validate input data
      const {
        title,
        description,
        eventType,
        startDate,
        endDate,
        location,
        address,
        city,
        state,
        country,
        zipCode,
        maxCapacity,
        price
      } = req.body;

      // Validate required fields
      if (!title || !description || !eventType || !startDate || !endDate || !location) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Get the uploaded files with full paths relative to uploads
      const bannerImage = req.files['bannerImage']
        ? req.files['bannerImage'][0].filename
        : null;

      const images = req.files['images']
        ? req.files['images'].map(file => file.filename)
        : [];

      // Insert event
      const eventResult = await client.query(
        `INSERT INTO events (
          title, description, event_type, start_date, end_date,
          location, address, city, state, country, zip_code,
          banner_image, organizer_id, max_capacity, price, 
          verification_status, is_published
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *`,
        [
          title,
          description,
          eventType,
          startDate,
          endDate,
          location,
          address || '',
          city || '',
          state || '',
          country || '',
          zipCode || '',
          bannerImage,
          req.user.id,
          maxCapacity || null,
          price || 0,
          'pending',  // default verification status
          false       // default is_published status
        ]
      );

      const event = eventResult.rows[0];

      // Insert images if any
      if (images.length > 0) {
        const imageValues = images.map(image =>
          `('${event.id}', '${image}')`
        ).join(', ');

        await client.query(`
          INSERT INTO event_images (event_id, image_url)
          VALUES ${imageValues}
        `);
      }

      // Handle stalls if provided
      if (req.body.stalls) {
        try {
          const stallsData = JSON.parse(req.body.stalls);

          if (Array.isArray(stallsData) && stallsData.length > 0) {
            for (const stall of stallsData) {
              await client.query(
                `INSERT INTO stalls (
                  event_id, name, description, price, size, 
                  location_in_venue, is_available, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())`,
                [
                  event.id,
                  stall.name || stall.type,
                  stall.description || '',
                  stall.price || 0,
                  stall.size || '',
                  stall.locationInVenue || ''
                ]
              );
            }
          }
        } catch (error) {
          console.error('Error processing stalls data:', error);
          // Continue with event creation even if stalls processing fails
        }
      }

      await client.query('COMMIT');

      // Get stalls associated with this event if any were created
      let eventStalls = [];
      if (req.body.stalls) {
        const stallsResult = await db.query(
          'SELECT * FROM stalls WHERE event_id = $1',
          [event.id]
        );
        eventStalls = stallsResult.rows;
      }

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        event,
        stalls: eventStalls.length > 0 ? eventStalls : undefined
      });
    } catch (error) {
      console.error('Event Creation Error:', error);
      await client.query('ROLLBACK');

      // Improved error response
      res.status(500).json({
        success: false,
        message: 'Failed to create event',
        error: error.message
      });
    } finally {
      client.release();
    }
  }
);

// Get single event by ID for editing (organizer only)
router.get('/edit/:id', authenticate, authorize('event_organizer', 'admin'), async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Check if event exists and belongs to this organizer
    const eventResult = await db.query(
      `SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1 AND (e.organizer_id = $2 OR $3 = true)`,
      [eventId, req.user.id, req.user.role === 'admin']
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Event not found or you are not authorized to edit it'
      });
    }

    const event = eventResult.rows[0];

    // Get event images
    const imagesResult = await db.query(
      'SELECT id, image_url FROM event_images WHERE event_id = $1',
      [eventId]
    );

    const eventWithImages = {
      ...event,
      images: imagesResult.rows
    };

    res.json({
      success: true,
      event: eventWithImages
    });
  } catch (error) {
    console.error('Error fetching event for edit:', error);
    next(error);
  }
});

// Update event (organizer only)
router.put('/:id',
  authenticate,
  authorize('event_organizer', 'admin'),
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  async (req, res, next) => {
    const eventId = req.params.id;
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // Check if event exists and belongs to the organizer
      const eventCheck = await client.query(
        'SELECT * FROM events WHERE id = $1 AND organizer_id = $2',
        [eventId, req.user.id]
      );

      if (eventCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Event not found or you do not have permission to update it' });
      }

      // Extract event data from request body
      const {
        title,
        description,
        eventType,
        startDate,
        endDate,
        location,
        address,
        city,
        state,
        country,
        zipCode,
        maxCapacity,
        price,
        hasStalls
      } = req.body;

      // Update event in database - Added verification_status and is_published
      const updateResult = await client.query(
        `UPDATE events
         SET title = $1, description = $2, event_type = $3, start_date = $4, end_date = $5,
             location = $6, address = $7, city = $8, state = $9, country = $10, zip_code = $11,
             max_capacity = $12, price = $13, updated_at = NOW(), 
             verification_status = 'pending', is_published = false
         WHERE id = $14 AND organizer_id = $15
         RETURNING *`,
        [
          title,
          description,
          eventType,
          startDate,
          endDate,
          location,
          address,
          city,
          state,
          country,
          zipCode,
          maxCapacity,
          price,
          eventId,
          req.user.id
        ]
      );

      // Handle banner image if provided
      if (req.files && req.files['bannerImage']) {
        const bannerImage = req.files['bannerImage'][0];
        const bannerFilename = path.basename(bannerImage.path);

        // Update banner image in database
        await client.query(
          'UPDATE events SET banner_image = $1 WHERE id = $2',
          [bannerFilename, eventId]
        );
      }

      // Handle additional images if provided
      if (req.files && req.files['images'] && req.files['images'].length > 0) {
        // Delete existing images first
        await client.query('DELETE FROM event_images WHERE event_id = $1', [eventId]);

        // Insert new images
        for (const image of req.files['images']) {
          const imageFilename = path.basename(image.path);
          await client.query(
            'INSERT INTO event_images (event_id, image_url) VALUES ($1, $2)',
            [eventId, imageFilename]
          );
        }
      }

      // Handle stalls if hasStalls is true
      if (hasStalls === 'true') {
        // Parse stalls JSON from request body
        const stalls = JSON.parse(req.body.stalls || '[]');

        // Delete existing stalls first
        await client.query('DELETE FROM stalls WHERE event_id = $1', [eventId]);

        // Insert new stalls
        for (const stall of stalls) {
          await client.query(
            `INSERT INTO stalls (
              event_id, 
              name, 
              description, 
              price, 
              size, 
              location_in_venue, 
              is_available
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              eventId,
              stall.type || stall.name,
              stall.description,
              stall.price,
              stall.size,
              stall.locationInVenue || null,
              true // Default to available
            ]
          );
        }
      } else {
        // If hasStalls is false, remove all stalls for this event
        await client.query('DELETE FROM stalls WHERE event_id = $1', [eventId]);
      }

      await client.query('COMMIT');

      // Get updated event with images
      const updatedEventResult = await db.query(
        `SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name
         FROM events e
         JOIN users u ON e.organizer_id = u.id
         WHERE e.id = $1`,
        [eventId]
      );

      // Get updated images
      const updatedImagesResult = await db.query(
        'SELECT id, image_url FROM event_images WHERE event_id = $1',
        [eventId]
      );

      // Get updated stalls
      const updatedStallsResult = await db.query(
        'SELECT * FROM stalls WHERE event_id = $1',
        [eventId]
      );

      const updatedEvent = {
        ...updatedEventResult.rows[0],
        images: updatedImagesResult.rows,
        stalls: updatedStallsResult.rows
      };

      res.json({ event: updatedEvent, message: 'Event updated successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating event:', error);
      next(error);
    } finally {
      client.release();
    }
  }
);

// Delete event (organizer only)
router.delete('/:id', authenticate, authorize('event_organizer', 'admin'), async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Check if event exists and belongs to this organizer
    const eventCheck = await db.query(
      'SELECT * FROM events WHERE id = $1 AND (organizer_id = $2 OR $3 = true)',
      [eventId, req.user.id, req.user.role === 'admin']
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found or you are not authorized to delete it' });
    }

    // Check if there are any bookings
    const bookingsCheck = await db.query(
      'SELECT COUNT(*) FROM bookings WHERE event_id = $1',
      [eventId]
    );

    if (parseInt(bookingsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        message: 'Cannot delete event with active bookings. Cancel all bookings first.'
      });
    }

    // Delete event (cascade will delete images)
    await db.query('DELETE FROM events WHERE id = $1', [eventId]);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get events by organizer
router.get('/organizer/myevents', authenticate, authorize('event_organizer'), async (req, res, next) => {
  try {
    const { page = 1, limit = 15, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT e.*, COUNT(b.id) as booking_count, SUM(b.total_price) as total_revenue
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      WHERE e.organizer_id = $1
    `;

    const queryParams = [req.user.id];
    let paramPosition = 2;

    if (status) {
      query += ` AND e.verification_status = $${paramPosition}`;
      queryParams.push(status);
      paramPosition++;
    }

    query += `
      GROUP BY e.id
      ORDER BY e.start_date DESC
      LIMIT $${paramPosition} OFFSET $${paramPosition + 1}
    `;

    queryParams.push(parseInt(limit), offset);

    const result = await db.query(query, queryParams);

    // Count total for pagination
    let countQuery = `
      SELECT COUNT(*) FROM events
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

// Add this route for event verification (admin only)
router.post('/verify/:id',
  authenticate,
  authorize('admin'),
  async (req, res, next) => {
    try {
      const eventId = req.params.id;
      const { status, feedback } = req.body;

      // Validate status
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected"' });
      }

      // Update event verification status
      const result = await db.query(
        `UPDATE events 
         SET verification_status = $1, 
             admin_feedback = $2,
             is_published = $3,
             updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [
          status === 'approved' ? 'verified' : 'rejected',
          feedback || null,
          status === 'approved', // Set is_published to true if approved
          eventId
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Get organizer email for notification
      const organizerQuery = await db.query(
        `SELECT u.email, u.first_name
         FROM users u
         JOIN events e ON u.id = e.organizer_id
         WHERE e.id = $1`,
        [eventId]
      );

      if (organizerQuery.rows.length > 0) {
        const { email, first_name } = organizerQuery.rows[0];
        // Here you would send an email notification with the feedback
        // This is where you'd implement email sending logic
        console.log(`Notification would be sent to ${email} with feedback: ${feedback}`);
      }

      res.json({
        message: `Event has been ${status}`,
        event: result.rows[0]
      });

    } catch (error) {
      next(error);
    }
  }
);

// Get events pending verification (admin only)
router.get('/admin/pending', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      WHERE e.verification_status = 'pending'
      ORDER BY e.created_at ASC
      LIMIT $1 OFFSET $2
    `;

    const result = await db.query(query, [parseInt(limit), offset]);

    // Get stalls for each event
    const events = result.rows;
    for (const event of events) {
      const stallsResult = await db.query(
        'SELECT * FROM stalls WHERE event_id = $1',
        [event.id]
      );
      event.stalls = stallsResult.rows;
    }

    // Count total pending
    const countResult = await db.query(
      'SELECT COUNT(*) FROM events WHERE verification_status = $1',
      ['pending']
    );

    const totalPending = parseInt(countResult.rows[0].count);

    res.json({
      events: events,
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

export default router;
