import { neon } from '@neondatabase/serverless';

// Get database connection string from environment variable
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set!');
}

const sql = neon(process.env.DATABASE_URL || '');

export { sql };

