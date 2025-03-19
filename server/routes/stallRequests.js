
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
        SELECT sr.*, s.name as stall_name, se.title as event_title
        FROM stall_requests sr
        JOIN stalls s ON sr.stall_id = s.id
        JOIN stall_events se ON s.stall_event_id = se.id
        WHERE sr.id = $1 AND sr.requester_id = $2
      `;
            params = [requestId, req.user.id];
        } else {
            // For organizers and admins
            query = `
        SELECT sr.*, s.name as stall_name, se.title as event_title,
               u.first_name || ' ' || u.last_name as requester_name
        FROM stall_requests sr
        JOIN stalls s ON sr.stall_id = s.id
        JOIN stall_events se ON s.stall_event_id = se.id
        JOIN users u ON sr.requester_id = u.id
        WHERE sr.id = $1 AND (se.organizer_id = $2 OR $3 = true)
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
        const { stallEventId, stallId, requestMessage } = req.body;

        // Validate required fields
        if (!stallEventId) {
            return res.status(400).json({ message: 'Stall event ID is required' });
        }

        // Verify stall event exists
        const eventCheck = await db.query(
            'SELECT organizer_id FROM stall_events WHERE id = $1',
            [stallEventId]
        );

        if (eventCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Stall event not found' });
        }

        const organizerId = eventCheck.rows[0].organizer_id;

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

        // Create request
        const result = await db.query(
            `INSERT INTO stall_requests (
          requester_id, stall_event_id, stall_id, organizer_id, request_message
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
            [req.user.id, stallEventId, stallId, organizerId, requestMessage]
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

        // Check if request exists and belongs to this organizer
        const requestCheck = await client.query(
            `SELECT sr.*, s.id as stall_id, se.title as event_title, s.name as stall_name
         FROM stall_requests sr
         JOIN stalls s ON sr.stall_id = s.id
         JOIN stall_events se ON s.stall_event_id = se.id
         WHERE sr.id = $1 AND (sr.organizer_id = $2 OR $3 = true) AND sr.status = 'pending'`,
            [requestId, req.user.id, req.user.role === 'admin']
        );

        if (requestCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                message: 'Stall request not found, not pending, or you are not authorized to manage it'
            });
        }

        const request = requestCheck.rows[0];

        // Update request status
        const updatedRequest = await client.query(
            `UPDATE stall_requests
         SET status = $1, response_message = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
            [status, feedback, requestId]
        );

        // If approved, assign the stall to the manager
        if (status === 'approved') {
            await client.query(
                `UPDATE stalls
           SET manager_id = $1, is_available = false, updated_at = NOW()
           WHERE id = $2`,
                [request.requester_id, request.stall_id]
            );
        }

        // Create notification for the requester
        const notificationTitle = `Stall Request ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        const notificationMessage = status === 'approved'
            ? `Your request to manage the stall "${request.stall_name}" at "${request.event_title}" has been approved.`
            : `Your request to manage the stall "${request.stall_name}" at "${request.event_title}" has been rejected. ${feedback || ''}`;

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

        let query = `
      SELECT sr.*, s.name as stall_name, 
             se.title as event_title, se.start_date, se.end_date
      FROM stall_requests sr
      JOIN stalls s ON sr.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
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

        let query = `
      SELECT sr.*, s.name as stall_name, 
             se.title as event_title,
             u.first_name || ' ' || u.last_name as requester_name
      FROM stall_requests sr
      JOIN stalls s ON sr.stall_id = s.id
      JOIN stall_events se ON s.stall_event_id = se.id
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
