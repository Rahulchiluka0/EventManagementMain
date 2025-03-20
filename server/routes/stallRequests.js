
import express from 'express';
import db from '../db/index.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const router = express.Router();

// Get stall request by ID
router.get('/:id', authenticate, authorize('stall_manager', 'event_organizer', 'admin'), async (req, res, next) => {
    try {
        const requestId = req.params.id;
        let query;
        let params;

        // Different queries based on user role
        if (req.user.role === 'stall_manager') {
            query = `
        SELECT sr.*, 
               COALESCE(s.name, 'N/A') as stall_name, 
               COALESCE(se.title, e.title) as event_title,
               CASE 
                  WHEN sr.stall_event_id IS NOT NULL THEN 'stall_event'
                  WHEN sr.event_id IS NOT NULL THEN 'regular_event'
                  ELSE NULL
               END as event_type
        FROM stall_requests sr
        LEFT JOIN stalls s ON sr.stall_id = s.id
        LEFT JOIN stall_events se ON sr.stall_event_id = se.id AND s.stall_event_id = se.id
        LEFT JOIN events e ON sr.event_id = e.id AND (s.event_id = e.id OR s.event_id IS NULL)
        WHERE sr.id = $1 AND sr.requester_id = $2
      `;
            params = [requestId, req.user.id];
        } else {
            // For organizers and admins
            query = `
        SELECT sr.*, 
               COALESCE(s.name, 'N/A') as stall_name, 
               COALESCE(se.title, e.title) as event_title,
               u.first_name || ' ' || u.last_name as requester_name,
               CASE 
                  WHEN sr.stall_event_id IS NOT NULL THEN 'stall_event'
                  WHEN sr.event_id IS NOT NULL THEN 'regular_event'
                  ELSE NULL
               END as event_type
        FROM stall_requests sr
        LEFT JOIN stalls s ON sr.stall_id = s.id
        LEFT JOIN stall_events se ON sr.stall_event_id = se.id AND s.stall_event_id = se.id
        LEFT JOIN events e ON sr.event_id = e.id AND (s.event_id = e.id OR s.event_id IS NULL)
        JOIN users u ON sr.requester_id = u.id
        WHERE sr.id = $1 AND (sr.organizer_id = $2 OR $3 = true)
      `;
            params = [requestId, req.user.id, req.user.role === 'admin'];
        }

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Stall request not found or you are not authorized to view it' });
        }

        res.json({ stallRequest: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Create a new stall request (stall manager only)
router.post('/', authenticate, authorize('stall_manager'), async (req, res, next) => {
    try {
        // Check if the request body is a string (possibly a stallEventId)
        if (typeof req.body === 'string' || (req.body && Object.keys(req.body).length === 0 && req.body.constructor === Object)) {
            const id = typeof req.body === 'string' ? req.body.trim() : '';

            // Check if it's a valid UUID
            if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }

            // Determine if this is a stall event ID
            const stallEventCheck = await db.query(
                'SELECT id, organizer_id FROM stall_events WHERE id = $1',
                [id]
            );

            if (stallEventCheck.rows.length > 0) {
                // It's a stall event ID
                const organizerId = stallEventCheck.rows[0].organizer_id;

                // Create request for the stall event
                const result = await db.query(
                    `INSERT INTO stall_requests (
                        requester_id, stall_event_id, event_id, organizer_id, request_message
                    )
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *`,
                    [req.user.id, id, null, organizerId, "I would like to request a stall at this event."]
                );

                // Create notification for organizer
                await db.query(
                    `INSERT INTO notifications (user_id, title, message)
                    VALUES ($1, $2, $3)`,
                    [
                        organizerId,
                        'New Stall Request',
                        `A new stall request has been submitted for your stall event.`
                    ]
                );

                return res.status(201).json({
                    message: 'Stall request submitted successfully',
                    request: result.rows[0]
                });
            }

            return res.status(404).json({ message: 'Stall event not found' });
        }

        // Original code for handling JSON object requests
        const { stallEventId, eventId, stallId, requestMessage } = req.body;

        // Validate required fields - either stallEventId or eventId must be provided
        if (!stallEventId && !eventId) {
            return res.status(400).json({ message: 'Either Stall event ID or Event ID is required' });
        }

        let organizerId;

        // Verify event exists based on which ID was provided
        if (stallEventId) {
            // For stall events
            const eventCheck = await db.query(
                'SELECT organizer_id FROM stall_events WHERE id = $1',
                [stallEventId]
            );

            if (eventCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Stall event not found' });
            }

            organizerId = eventCheck.rows[0].organizer_id;

            // Check if stall exists if stallId is provided
            if (stallId) {
                const stallCheck = await db.query(
                    'SELECT * FROM stalls WHERE id = $1 AND stall_event_id = $2',
                    [stallId, stallEventId]
                );

                if (stallCheck.rows.length === 0) {
                    return res.status(404).json({ message: 'Stall not found or does not belong to this event' });
                }
            }
        } else {
            // For regular events
            const eventCheck = await db.query(
                'SELECT organizer_id FROM events WHERE id = $1',
                [eventId]
            );

            if (eventCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Event not found' });
            }

            organizerId = eventCheck.rows[0].organizer_id;

            // Check if stall exists if stallId is provided
            if (stallId) {
                const stallCheck = await db.query(
                    'SELECT * FROM stalls WHERE id = $1 AND event_id = $2',
                    [stallId, eventId]
                );

                if (stallCheck.rows.length === 0) {
                    return res.status(404).json({ message: 'Stall not found or does not belong to this event' });
                }
            }
        }

        // Create request
        const result = await db.query(
            `INSERT INTO stall_requests (
          requester_id, stall_event_id, event_id, stall_id, organizer_id, request_message
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
            [req.user.id, stallEventId || null, eventId || null, stallId, organizerId, requestMessage]
        );

        // Create notification for organizer
        await db.query(
            `INSERT INTO notifications (user_id, title, message)
         VALUES ($1, $2, $3)`,
            [
                organizerId,
                'New Stall Request',
                `A new stall request has been submitted for your event.`
            ]
        );

        res.status(201).json({
            message: 'Stall request submitted successfully',
            request: result.rows[0]
        });
    } catch (error) {
        console.error('Stall request error:', error);
        next(error);
    }
});

// Update request status (stall organizer only)
// router.put('/:id/status', authenticate, authorize('stall_organizer', 'admin'), async (req, res, next) => {
//     const client = await db.getClient();

//     try {
//         await client.query('BEGIN');

//         const requestId = req.params.id;
//         const { status, feedback } = req.body;

//         if (!['approved', 'rejected'].includes(status)) {
//             await client.query('ROLLBACK');
//             return res.status(400).json({ message: 'Invalid status. Must be approved or rejected' });
//         }

//         // Check if request exists and belongs to this organizer
//         const requestCheck = await client.query(
//             `SELECT sr.*, s.id as stall_id, se.title as event_title, s.name as stall_name
//        FROM stall_requests sr
//        JOIN stalls s ON sr.stall_id = s.id
//        JOIN stall_events se ON s.stall_event_id = se.id
//        WHERE sr.id = $1 AND (sr.organizer_id = $2 OR $3 = true) AND sr.status = 'pending'`,
//             [requestId, req.user.id, req.user.role === 'admin']
//         );

//         if (requestCheck.rows.length === 0) {
//             await client.query('ROLLBACK');
//             return res.status(404).json({
//                 message: 'Stall request not found, not pending, or you are not authorized to manage it'
//             });
//         }

//         const request = requestCheck.rows[0];

//         // Update request status
//         const updatedRequest = await client.query(
//             `UPDATE stall_requests
//        SET status = $1, feedback = $2, updated_at = NOW()
//        WHERE id = $3
//        RETURNING *`,
//             [status, feedback, requestId]
//         );

//         // If approved, assign the stall to the manager
//         if (status === 'approved') {
//             await client.query(
//                 `UPDATE stalls
//          SET manager_id = $1, is_available = false, updated_at = NOW()
//          WHERE id = $2`,
//                 [request.requester_id, request.stall_id]
//             );
//         }

//         // Create notification for the requester
//         const notificationTitle = `Stall Request ${status.charAt(0).toUpperCase() + status.slice(1)}`;
//         const notificationMessage = status === 'approved'
//             ? `Your request to manage the stall "${request.stall_name}" at "${request.event_title}" has been approved.`
//             : `Your request to manage the stall "${request.stall_name}" at "${request.event_title}" has been rejected. ${feedback || ''}`;

//         await client.query(
//             `INSERT INTO notifications (user_id, title, message)
//        VALUES ($1, $2, $3)`,
//             [request.requester_id, notificationTitle, notificationMessage]
//         );

//         await client.query('COMMIT');

//         res.json({
//             message: `Stall request ${status} successfully`,
//             stallRequest: updatedRequest.rows[0]
//         });
//     } catch (error) {
//         await client.query('ROLLBACK');
//         next(error);
//     } finally {
//         client.release();
//     }
// });
router.put('/:id/status', authenticate, authorize('event_organizer', 'admin'), async (req, res, next) => {
    const client = await db.getClient();

    try {
        await client.query('BEGIN');

        const requestId = req.params.id;
        const { status, feedback } = req.body;

        if (!['verified', 'rejected'].includes(status)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Invalid status. Must be verified or rejected' });
        }

        // First check if the request exists
        const requestExistsQuery = `
            SELECT sr.*, sr.stall_id
            FROM stall_requests sr
            WHERE sr.id = $1 AND (sr.organizer_id = $2 OR $3 = true) AND sr.status = 'pending'
        `;

        const requestExists = await client.query(requestExistsQuery, [requestId, req.user.id, req.user.role === 'admin']);

        if (requestExists.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                message: 'Stall request not found, not pending, or you are not authorized to manage it'
            });
        }

        const request = requestExists.rows[0];
        let eventTitle, stallName;

        // Get event and stall details based on whether it's a stall event or regular event
        if (request.stall_event_id) {
            // For stall events
            const detailsQuery = `
                SELECT s.name as stall_name, se.title as event_title
                FROM stalls s
                JOIN stall_events se ON s.stall_event_id = se.id
                WHERE s.id = $1
            `;
            const details = await client.query(detailsQuery, [request.stall_id]);

            if (details.rows.length > 0) {
                stallName = details.rows[0].stall_name;
                eventTitle = details.rows[0].event_title;
            }
        } else if (request.event_id) {
            // For regular events
            const detailsQuery = `
                SELECT s.name as stall_name, e.title as event_title
                FROM stalls s
                JOIN events e ON s.event_id = e.id
                WHERE s.id = $1
            `;
            const details = await client.query(detailsQuery, [request.stall_id]);

            if (details.rows.length > 0) {
                stallName = details.rows[0].stall_name;
                eventTitle = details.rows[0].event_title;
            }
        }

        // Update request status
        const updatedRequest = await client.query(
            `UPDATE stall_requests
             SET status = $1, response_message = $2, updated_at = NOW()
             WHERE id = $3
             RETURNING *`,
            [status, feedback, requestId]
        );

        // If verified, assign the stall to the manager
        if (status === 'verified') {
            await client.query(
                `UPDATE stalls
                 SET manager_id = $1, is_available = false, updated_at = NOW()
                 WHERE id = $2`,
                [request.requester_id, request.stall_id]
            );
        }

        // Create notification for the requester
        const notificationTitle = `Stall Request ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        const notificationMessage = status === 'verified'
            ? `Your request to manage the stall "${stallName || 'requested'}" at "${eventTitle || 'the event'}" has been approved.`
            : `Your request to manage the stall "${stallName || 'requested'}" at "${eventTitle || 'the event'}" has been rejected. ${feedback || ''}`;

        await client.query(
            `INSERT INTO notifications (user_id, title, message)
             VALUES ($1, $2, $3)`,
            [request.requester_id, notificationTitle, notificationMessage]
        );

        await client.query('COMMIT');

        res.json({
            message: `Stall request ${status} successfully`,
            stallRequest: updatedRequest.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
});

// Get stall requests for the current stall manager
router.get('/manager/requests', authenticate, authorize('stall_manager'), async (req, res, next) => {
    try {
        const { status } = req.query;

        // Updated query to handle both stall events and regular events
        let query = `
      SELECT sr.*, 
             COALESCE(s.name, 'N/A') as stall_name, 
             COALESCE(se.title, e.title) as event_title,
             COALESCE(se.start_date, e.start_date) as start_date,
             COALESCE(se.end_date, e.end_date) as end_date,
             CASE 
                WHEN sr.stall_event_id IS NOT NULL THEN 'stall_event'
                WHEN sr.event_id IS NOT NULL THEN 'regular_event'
                ELSE NULL
             END as event_type
      FROM stall_requests sr
      LEFT JOIN stalls s ON sr.stall_id = s.id
      LEFT JOIN stall_events se ON sr.stall_event_id = se.id AND s.stall_event_id = se.id
      LEFT JOIN events e ON sr.event_id = e.id AND (s.event_id = e.id OR s.event_id IS NULL)
      WHERE sr.requester_id = $1
    `;

        const queryParams = [req.user.id];

        if (status) {
            query += ` AND sr.status = $2`;
            queryParams.push(status);
        }

        query += ` ORDER BY sr.created_at DESC`;

        const result = await db.query(query, queryParams);

        res.json({ stallRequests: result.rows });
    } catch (error) {
        next(error);
    }
});

// Get stall requests for the current stall organizer
router.get('/organizer/requests', authenticate, authorize('event_organizer'), async (req, res, next) => {
    try {
        const { status } = req.query;

        // Updated query to handle both stall events and regular events
        let query = `
      SELECT sr.*, 
             COALESCE(s.name, 'N/A') as stall_name, 
             COALESCE(se.title, e.title) as event_title,
             u.first_name || ' ' || u.last_name as requester_name,
             CASE 
                WHEN sr.stall_event_id IS NOT NULL THEN 'stall_event'
                WHEN sr.event_id IS NOT NULL THEN 'regular_event'
                ELSE NULL
             END as event_type
      FROM stall_requests sr
      LEFT JOIN stalls s ON sr.stall_id = s.id
      LEFT JOIN stall_events se ON sr.stall_event_id = se.id
      LEFT JOIN events e ON sr.event_id = e.id
      JOIN users u ON sr.requester_id = u.id
      WHERE sr.organizer_id = $1
    `;

        const queryParams = [req.user.id];

        if (status) {
            query += ` AND sr.status = $2`;
            queryParams.push(status);
        }

        query += ` ORDER BY sr.created_at DESC`;

        const result = await db.query(query, queryParams);

        res.json({ stallRequests: result.rows });
    } catch (error) {
        next(error);
    }
});

export default router;
