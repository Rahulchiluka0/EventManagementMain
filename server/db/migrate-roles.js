import db from './index.js';

async function migrateRoles() {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // First check if the stall_organizer role still exists in the enum
    const checkTypeQuery = `
      SELECT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'user_role'
        AND e.enumlabel = 'stall_organizer'
      ) as exists_role;
    `;

    const checkResult = await client.query(checkTypeQuery);
    const roleExists = checkResult.rows[0].exists_role;

    if (roleExists) {
      console.log('Migrating stall_organizer users to event_organizer...');

      // Update existing stall_organizer users to event_organizer
      const updateResult = await client.query(`
        UPDATE users 
        SET role = 'event_organizer'::user_role 
        WHERE role = 'stall_organizer'::user_role
        RETURNING id, email
      `);

      console.log(`Updated ${updateResult.rowCount} users from stall_organizer to event_organizer`);

      // Use the safer approach that works with all PostgreSQL versions
      console.log('Recreating the enum without stall_organizer...');

      // First, get the current default value
      const getDefaultQuery = `
        SELECT pg_get_expr(d.adbin, d.adrelid) as default_expr
        FROM pg_catalog.pg_attribute a
        LEFT JOIN pg_catalog.pg_attrdef d ON (a.attrelid, a.attnum) = (d.adrelid, d.adnum)
        WHERE a.attrelid = 'users'::regclass
        AND a.attname = 'role'
        AND a.atthasdef
      `;

      const defaultResult = await client.query(getDefaultQuery);
      const defaultValue = defaultResult.rows.length > 0 ? defaultResult.rows[0].default_expr : null;

      // Drop the default constraint
      await client.query(`
        ALTER TABLE users ALTER COLUMN role DROP DEFAULT
      `);

      // Create a new enum type
      await client.query(`
        CREATE TYPE user_role_new AS ENUM ('user', 'event_organizer', 'stall_manager', 'admin')
      `);

      // Update the column to use the new enum
      await client.query(`
        ALTER TABLE users 
        ALTER COLUMN role TYPE user_role_new 
        USING (
          CASE 
            WHEN role::text = 'stall_organizer' THEN 'event_organizer'::user_role_new
            ELSE role::text::user_role_new
          END
        )
      `);

      // Drop the old enum
      await client.query(`
        DROP TYPE user_role
      `);

      // Rename the new enum to the original name
      await client.query(`
        ALTER TYPE user_role_new RENAME TO user_role
      `);

      // Restore the default value if it existed
      if (defaultValue) {
        // If the default was 'user', set it back
        if (defaultValue.includes("'user'")) {
          await client.query(`
            ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user'::user_role
          `);
        }
      }

      console.log('Successfully recreated user_role enum without stall_organizer');
    } else {
      console.log('stall_organizer role does not exist in the enum, no migration needed');
    }

    await client.query('COMMIT');
    console.log('Role migration completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during role migration:', error);
    throw error;
  } finally {
    client.release();
  }
}

migrateRoles().catch(console.error);