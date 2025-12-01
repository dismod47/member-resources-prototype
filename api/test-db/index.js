import { sql } from '../db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        success: false,
        error: 'DATABASE_URL not configured',
        message: 'The DATABASE_URL environment variable is not set in Vercel.',
        fix: 'Add DATABASE_URL in Vercel Settings → Environment Variables'
      });
    }

    // Check if connection string looks valid
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      return res.status(500).json({
        success: false,
        error: 'Invalid connection string format',
        message: `DATABASE_URL should start with 'postgresql://' but it starts with: ${dbUrl.substring(0, 20)}...`,
        fix: 'Make sure you copied the full connection string from Neon dashboard, not just "psql \'mykey\'"'
      });
    }

    // Test database connection
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    
    // Test if tables exist
    const tablesCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('posts', 'comments')
      ORDER BY table_name
    `;

    const tablesExist = tablesCheck.map(t => t.table_name);
    const allTablesExist = tablesExist.includes('posts') && tablesExist.includes('comments');

    // Count posts
    let postsCount = 0;
    try {
      const countResult = await sql`SELECT COUNT(*) as count FROM posts`;
      postsCount = parseInt(countResult[0]?.count || 0);
    } catch (err) {
      // Table might not exist yet
    }

    return res.status(200).json({
      success: true,
      message: 'Database connection successful!',
      database: {
        connected: true,
        timestamp: result[0]?.current_time,
        postgresVersion: result[0]?.pg_version?.split(' ')[0] + ' ' + result[0]?.pg_version?.split(' ')[1],
        tablesExist: allTablesExist,
        tablesFound: tablesExist,
        postsCount: postsCount
      },
      recommendations: allTablesExist 
        ? postsCount === 0 
          ? 'Tables exist but no posts found. Run the seed-data.sql script in Neon to add demo posts.'
          : 'Everything looks good! Your database is connected and has posts.'
        : 'Tables do not exist. Run the schema.sql script in Neon SQL Editor to create the tables.'
    });
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: error.message,
      details: error.stack,
      troubleshooting: {
        step1: 'Verify DATABASE_URL is set correctly in Vercel (should start with postgresql://)',
        step2: 'Check that your Neon database is active (it may pause on free tier)',
        step3: 'Verify the connection string from Neon dashboard matches exactly',
        step4: 'Check Vercel function logs for more details'
      }
    });
  }
}

