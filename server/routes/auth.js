
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import { authenticate } from '../middleware/authenticate.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const router = express.Router();

// Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role = 'user', phone } = req.body;

    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate role
    const validRoles = ['user', 'event_organizer', 'stall_organizer', 'stall_manager', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.query(
      `INSERT INTO users (email, password, first_name, last_name, role, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, role, verification_status`,
      [email, hashedPassword, firstName, lastName, role, phone]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );

    // Set HTTP-only cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        verificationStatus: user.verification_status
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await db.query(
      `SELECT id, email, password, first_name, last_name, role, verification_status
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If user is an organizer with rejected status, get the rejection reason
    let rejectionReason = null;
    if (user.role === 'event_organizer' && user.verification_status === 'rejected') {
      const noteResult = await db.query(
        `SELECT note FROM verification_notes 
         WHERE user_id = $1 AND status = 'rejected'
         ORDER BY created_at DESC LIMIT 1`,
        [user.id]
      );

      if (noteResult.rows.length > 0) {
        rejectionReason = noteResult.rows[0].note;
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );

    // Set HTTP-only cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict'
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        verificationStatus: user.verification_status
      },
      rejectionReason: rejectionReason
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh-token', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    // Check if REFRESH_TOKEN_SECRET is set
    if (!process.env.REFRESH_TOKEN_SECRET) {
      console.error('REFRESH_TOKEN_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Verify token exists in database and not expired
    const tokenResult = await db.query(
      `SELECT * FROM refresh_tokens 
       WHERE token = $1 AND expires_at > NOW()`,
      [refreshToken]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Verify JWT
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Get user
    const userResult = await db.query(
      `SELECT id, email, first_name, last_name, role, verification_status
       FROM users WHERE id = $1`,
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Generate new token
    const newToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set HTTP-only cookie with new token
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });

    res.json({
      message: 'Token refreshed successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        verificationStatus: user.verification_status
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    next(error);
  }
});

// Logout
router.post('/logout', (req, res) => {
  // Clear cookies
  res.clearCookie('token');
  res.clearCookie('refreshToken');

  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticate, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      role: req.user.role,
      verificationStatus: req.user.verification_status
    }
  });
});

// Setup multer storage for organizer documents
const organizerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/organizers');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniquePrefix + '-' + file.originalname);
  }
});

// Configure multer upload for organizer registration
const organizerUpload = multer({
  storage: organizerStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept only certain file types
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG files are allowed'));
    }
  }
}).fields([
  { name: 'panCard', maxCount: 1 },
  { name: 'canceledCheck', maxCount: 1 },
  { name: 'agreement', maxCount: 1 }
]);

// Register an event organizer
router.post('/register-organizer', organizerUpload, async (req, res, next) => {
  try {
    console.log('Received organizer registration request:', req.body);
    console.log('Files received:', req.files);

    const {
      firstName, lastName, email, password, phone,
      organizationName, website, description, eventTypes,
      taxId, role
    } = req.body;

    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Parse eventTypes if it's a string
    let parsedEventTypes = eventTypes;
    if (typeof eventTypes === 'string') {
      try {
        parsedEventTypes = JSON.parse(eventTypes);
      } catch (e) {
        console.error('Error parsing eventTypes:', e);
        parsedEventTypes = [];
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Begin transaction
    await db.query('BEGIN');

    // Insert user
    const userResult = await db.query(
      `INSERT INTO users (email, password, first_name, last_name, role, phone, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, first_name, last_name, role, verification_status`,
      [email, hashedPassword, firstName, lastName, 'event_organizer', phone, 'pending']
    );

    const user = userResult.rows[0];

    // Get file paths
    const panCardPath = req.files.panCard ? req.files.panCard[0].filename : null;
    const canceledCheckPath = req.files.canceledCheck ? req.files.canceledCheck[0].filename : null;
    const agreementPath = req.files.agreement ? req.files.agreement[0].filename : null;

    // Insert organizer details
    await db.query(
      `INSERT INTO organizer_profiles 
       (user_id, organization_name, website, description, event_types, tax_id, pan_card_path, canceled_check_path, agreement_path)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9)`,
      [
        user.id,
        organizationName,
        website || null,
        description,
        JSON.stringify(parsedEventTypes), // Convert to valid JSON string
        taxId || null,
        panCardPath,
        canceledCheckPath,
        agreementPath
      ]
    );


    // Commit transaction
    await db.query('COMMIT');

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );

    // Set HTTP-only cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict'
    });

    res.status(201).json({
      message: 'Organizer registration submitted successfully. Your application is pending review.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        verificationStatus: user.verification_status
      }
    });
  } catch (error) {
    // Rollback transaction in case of error
    await db.query('ROLLBACK');
    console.error('Error in organizer registration:', error);
    next(error);
  }
});

// Reapply as organizer (for rejected applications)
router.put('/reapply-organizer', organizerUpload, async (req, res, next) => {
  try {
    console.log('Received organizer reapplication request:', req.body);
    console.log('Files received for reapplication:', req.files);

    const {
      userId, organizationName, website, description,
      taxId, eventTypes
    } = req.body;

    // Verify the user exists and was previously rejected
    const userResult = await db.query(
      'SELECT * FROM users WHERE id = $1 AND verification_status = $2',
      [userId, 'rejected']
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found or not eligible for reapplication' });
    }

    // Start transaction
    await db.query('BEGIN');

    // Update user verification status back to pending
    await db.query(
      'UPDATE users SET verification_status = $1, updated_at = NOW() WHERE id = $2',
      ['pending', userId]
    );

    // Process file uploads
    const panCardPath = req.files.panCard ? req.files.panCard[0].filename : null;
    const canceledCheckPath = req.files.canceledCheck ? req.files.canceledCheck[0].filename : null;
    const agreementPath = req.files.agreement ? req.files.agreement[0].filename : null;

    // Parse eventTypes if it's a string
    let parsedEventTypes = eventTypes;
    if (typeof eventTypes === 'string') {
      try {
        parsedEventTypes = JSON.parse(eventTypes);
      } catch (e) {
        console.error('Error parsing eventTypes in reapplication:', e);
        parsedEventTypes = [];
      }
    }

    // Check if organizer profile exists
    const profileResult = await db.query(
      'SELECT * FROM organizer_profiles WHERE user_id = $1',
      [userId]
    );

    if (profileResult.rows.length > 0) {
      // Update existing profile
      await db.query(
        `UPDATE organizer_profiles 
         SET organization_name = $1, website = $2, description = $3,
             tax_id = $4, event_types = $5::jsonb, 
             pan_card_path = COALESCE($6, pan_card_path),
             canceled_check_path = COALESCE($7, canceled_check_path),
             agreement_path = COALESCE($8, agreement_path),
             updated_at = NOW()
         WHERE user_id = $9`,
        [
          organizationName,
          website || null,
          description,
          taxId || null,
          JSON.stringify(parsedEventTypes), // Convert to valid JSON string
          panCardPath,
          canceledCheckPath,
          agreementPath,
          userId
        ]
      );
    } else {
      // Create new profile (shouldn't normally happen, but just in case)
      await db.query(
        `INSERT INTO organizer_profiles 
         (user_id, organization_name, website, description, tax_id, 
          event_types, pan_card_path, canceled_check_path, agreement_path)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9)`,
        [
          userId,
          organizationName,
          website || null,
          description,
          taxId || null,
          JSON.stringify(parsedEventTypes), // Convert to valid JSON string
          panCardPath,
          canceledCheckPath,
          agreementPath
        ]
      );
    }

    // Commit transaction
    await db.query('COMMIT');

    res.status(200).json({
      message: 'Organizer reapplication submitted successfully. Your account is pending verification.'
    });
  } catch (error) {
    // Rollback transaction in case of error
    await db.query('ROLLBACK');
    console.error('Error in organizer reapplication:', error);
    next(error);
  }
});


export default router;
