import { neon } from '@neondatabase/serverless';

// Get database connection string from environment variable
const sql = neon(process.env.DATABASE_URL);

export { sql };

