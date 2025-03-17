import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Serve static files from "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import bookingsRoutes from './routes/bookings.js';
import usersRoutes from './routes/users.js';
import stallsRoutes from './routes/stalls.js';
import paymentsRoutes from './routes/payments.js';
import dashboardRoutes from './routes/dashboard.js';
import stallRequestsRoutes from './routes/stallRequests.js';
import inventoryRoutes from './routes/inventory.js';

import { errorHandler } from './middleware/errorHandler.js';
import { authenticate, authorize } from './middleware/authenticate.js';
import db from './db/index.js';

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/users', authenticate, usersRoutes);
app.use('/api/stalls', authenticate, stallsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);
app.use('/api/stall-requests', stallRequestsRoutes)

// Make sure stall events are included in admin routes
app.get('/api/admin/pending-all', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    // Get both pending events and stall events
    const eventsPromise = db.query(
      `SELECT e.*, 'event' as type, u.first_name || ' ' || u.last_name as organizer_name
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.verification_status = 'pending'`
    );

    const stallEventsPromise = db.query(
      `SELECT se.*, 'stall_event' as type, u.first_name || ' ' || u.last_name as organizer_name
       FROM stall_events se
       JOIN users u ON se.organizer_id = u.id
       WHERE se.verification_status = 'pending'`
    );

    const [eventsResult, stallEventsResult] = await Promise.all([eventsPromise, stallEventsPromise]);

    res.json({
      pendingItems: [
        ...eventsResult.rows,
        ...stallEventsResult.rows
      ]
    });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use(errorHandler);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;


