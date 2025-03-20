
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './index.js';
import bcrypt from 'bcrypt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Add the users schema path
const userSchemaPath = path.join(__dirname, 'schema-users.sql');
// const userSchema = fs.readFileSync(userSchemaPath, 'utf8');

// Add the events schema path
const organiserSchemaPath = path.join(__dirname, 'schema-organizer-profile.sql');

// Add the events schema path
const eventsSchemaPath = path.join(__dirname, 'schema-events.sql');

// Add the notifications schema path
const notificationsSchemaPath = path.join(__dirname, 'schema-notifications.sql');

// Add the verification-notes schema path
const verificationNotesSchemaPath = path.join(__dirname, 'schema-verification-notes.sql');

// Add the stalls schema path
const stallsSchemaPath = path.join(__dirname, 'schema-stalls.sql');

// Add the stalls request schema path
const stallRequestsSchemaPath = path.join(__dirname, 'schema-stall-requests.sql');

// Add the stall Events schema path
const stallEventsSchemaPath = path.join(__dirname, 'schema-stall-events.sql');

// Add the inventory schema path
const inventorySchemaPath = path.join(__dirname, 'inventory_schema.sql');

// Add the bookings schema path
const bookingsSchemaPath = path.join(__dirname, 'schema-bookings.sql');

// Add the booking status schema path
const bookingStatusSchemaPath = path.join(__dirname, 'schema-booking-status.sql');

// Add the payments schema path
const paymentsSchemaPath = path.join(__dirname, 'schema-payments.sql');

const userSchema = fs.readFileSync(userSchemaPath, 'utf8');
const organiserSchema = fs.readFileSync(organiserSchemaPath, 'utf8');
const eventsSchema = fs.readFileSync(eventsSchemaPath, 'utf8');
const notificationsSchema = fs.readFileSync(notificationsSchemaPath, 'utf8');
const verificationNotesSchema = fs.readFileSync(verificationNotesSchemaPath, 'utf8');
const stallsSchema = fs.readFileSync(stallsSchemaPath, 'utf8');
const stallRequestsSchema = fs.readFileSync(stallRequestsSchemaPath, 'utf8');
const stallEventsSchema = fs.readFileSync(stallEventsSchemaPath, 'utf8');
const inventorySchema = fs.readFileSync(inventorySchemaPath, 'utf8');
const bookingsSchema = fs.readFileSync(bookingsSchemaPath, 'utf8');
const bookingStatusSchema = fs.readFileSync(bookingStatusSchemaPath, 'utf8');
const paymentsSchema = fs.readFileSync(paymentsSchemaPath, 'utf8');

async function initializeDatabase() {
  const client = await db.getClient();

  try {
    // First, explicitly create the UUID extension
    console.log('Creating UUID extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    try {
      console.log('Creating user schema and enums...');
      // Execute user schema first (contains enums and users table)
      await client.query(userSchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some types already exist, continuing...');
      } else {
        throw error;
      }
    }

    try {
      console.log('Creating organizer schema...');
      // Execute events schema
      await client.query(organiserSchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some event types already exist, continuing...');
      } else {
        throw error;
      }
    }

    try {
      console.log('Creating events schema...');
      // Execute events schema
      await client.query(eventsSchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some event types already exist, continuing...');
      } else {
        throw error;
      }
    }

    try {
      console.log('Creating notifications schema...');
      // Execute notifications schema
      await client.query(notificationsSchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some notifications types already exist, continuing...');
      } else {
        throw error;
      }
    }
    try {
      console.log('Creating verification notes schema...');
      // Execute verification Notes schema
      await client.query(verificationNotesSchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some verification Notes types already exist, continuing...');
      } else {
        throw error;
      }
    }



    try {
      console.log('Creating stall Events schema...');
      // Execute stalls schema
      await client.query(stallEventsSchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some stalls types already exist, continuing...');
      } else {
        throw error;
      }
    }

    try {
      console.log('Creating stalls schema...');
      // Execute stalls schema
      await client.query(stallsSchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some stalls types already exist, continuing...');
      } else {
        throw error;
      }
    }
    try {
      console.log('Creating stall requests schema...');
      // Execute stalls schema
      await client.query(stallRequestsSchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some stalls types already exist, continuing...');
      } else {
        throw error;
      }
    }
    try {
      console.log('Creating inventory schema...');
      // Execute inventory schema
      await client.query(inventorySchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some inventory types already exist, continuing...');
      } else {
        throw error;
      }
    }


    try {
      console.log('Creating booking status schema...');
      // Execute booking status schema
      await client.query(bookingStatusSchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some booking status types already exist, continuing...');
      } else {
        throw error;
      }
    }

    try {
      console.log('Creating bookings schema...');
      // Execute bookings schema
      await client.query(bookingsSchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some bookings types already exist, continuing...');
      } else {
        throw error;
      }
    }

    try {
      console.log('Creating payments schema...');
      // Execute payments schema
      await client.query(paymentsSchema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some payments types already exist, continuing...');
      } else {
        throw error;
      }
    }


    try {
      console.log('Creating remaining schema...');
      // Execute main schema
      await client.query(schema);
    } catch (error) {
      // If the error is about types already existing, we can continue
      if (error.code === '42710') {
        console.log('Some types already exist, continuing...');
      } else {
        throw error;
      }
    }

    // Ensure phone column exists in users table
    try {
      console.log('Ensuring phone column exists in users table...');
      await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS phone VARCHAR(20)
          `);
    } catch (error) {
      console.error('Error adding phone column:', error);
    }


    // Ensure refresh_tokens table exists
    try {
      console.log('Ensuring refresh_tokens table exists...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token VARCHAR(255) NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } catch (error) {
      console.error('Error creating refresh_tokens table:', error);
    }

    // Check if admin user exists, create if not
    const adminExists = await client.query(
      'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
      ['admin@example.com']
    );

    if (!adminExists.rows[0].exists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        `INSERT INTO users (email, password, first_name, last_name, role, verification_status) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['admin@example.com', hashedPassword, 'Admin', 'User', 'admin', 'verified']
      );
      console.log('Admin user created');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run initialization if this file is executed directly
initializeDatabase().catch(console.error);
