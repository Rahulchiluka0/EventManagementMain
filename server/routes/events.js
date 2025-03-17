
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
      COUNT(ei.id) as image_count
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
    const countQuery = `
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

    const eventWithImages = {
      ...event,
      images: imagesResult.rows
    };

    res.json({ event: eventWithImages });
  } catch (error) {
    next(error);
  }
});

// Get single event by ID (for organizer)
router.get('/organiser/myevents/:id', async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Get event details
    const eventResult = await db.query(
      `SELECT e.*, u.first_name || ' ' || u.last_name as organizer_name
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1 `,
      [eventId]
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

    const eventWithImages = {
      ...event,
      images: imagesResult.rows
    };

    res.json({ event: eventWithImages });
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

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        event
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

// Update event (organizer only) - existing route
router.put('/:id', authenticate, authorize('event_organizer', 'admin'), 
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  async (req, res, next) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const eventId = req.params.id;

    // Check if event exists and belongs to this organizer
    const eventCheck = await client.query(
      'SELECT * FROM events WHERE id = $1 AND (organizer_id = $2 OR $3 = true)',
      [eventId, req.user.id, req.user.role === 'admin']
    );

    if (eventCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Event not found or you are not authorized to edit it' });
    }

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
      bannerImage,
      maxCapacity,
      price,
      isPublished,
      images = []
    } = req.body;

    // Update event
    const updateResult = await client.query(
      `UPDATE events
       SET title = $1, description = $2, event_type = $3,
           start_date = $4, end_date = $5, location = $6,
           address = $7, city = $8, state = $9,
           country = $10, zip_code = $11, banner_image = $12,
           max_capacity = $13, price = $14, is_published = $15,
           updated_at = NOW()
       WHERE id = $16
       RETURNING *`,
      [
        title, description, eventType,
        startDate, endDate, location,
        address, city, state,
        country, zipCode, bannerImage,
        maxCapacity, price, isPublished,
        eventId
      ]
    );

    const updatedEvent = updateResult.rows[0];

    // Handle images update if provided
    if (images.length > 0) {
      // Delete current images
      await client.query('DELETE FROM event_images WHERE event_id = $1', [eventId]);

      // Insert new images
      const imageValues = images.map(image => {
        return `('${eventId}', '${image}')`;
      }).join(', ');

      await client.query(`
        INSERT INTO event_images (event_id, image_url)
        VALUES ${imageValues}
      `);
    }

    await client.query('COMMIT');

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

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
    const countQuery = `
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

    // Count total pending
    const countResult = await db.query(
      'SELECT COUNT(*) FROM events WHERE verification_status = $1',
      ['pending']
    );

    const totalPending = parseInt(countResult.rows[0].count);

    res.json({
      events: result.rows,
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
