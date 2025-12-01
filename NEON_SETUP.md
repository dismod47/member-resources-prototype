# Neon Database Setup Instructions

## Step 1: Create a Neon Account and Database

1. Go to [https://neon.tech](https://neon.tech) and sign up/login
2. Click "Create a project"
3. Choose a project name (e.g., "scholarship-prototype")
4. Select a region closest to you
5. Choose PostgreSQL version (14 or 15 is fine)
6. Click "Create project"

## Step 2: Get Your Connection String

1. Once your project is created, you'll see the "Connection Details" or "Connection String"
2. Click "Connection String" tab
3. Copy the connection string (it should look like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)

## Step 3: Create Database Tables

1. In the Neon dashboard, click on "SQL Editor" or "Query"
2. Copy the contents of `api/schema.sql` file
3. Paste it into the SQL editor
4. Run the query to create the tables

Alternatively, you can use the Neon CLI or any PostgreSQL client to run the schema.

## Step 3.5: Add Demo Posts (Optional but Recommended)

To populate your database with 10 high-quality demo posts about Java, Database, Marketing, Coding, and Python:

1. In the Neon dashboard SQL Editor, copy and run the contents of `api/seed-data.sql`
2. This will create 10 demo posts with comments that cannot be deleted or edited
3. Demo posts are marked with a "Demo" badge in the UI

**Note:** If you already created the posts table before adding the `is_demo` column, run `api/migration-add-demo-flag.sql` first, then run the seed data.

## Step 4: Set Environment Variable on Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new environment variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon connection string from Step 2
   - **Environment**: Production, Preview, and Development (check all)
4. Click "Save"

## Step 5: Redeploy Your Application

After adding the environment variable, redeploy your application:
- Go to the Deployments tab
- Click "..." on the latest deployment
- Click "Redeploy"

Or simply push a new commit to trigger a new deployment.

## Testing Locally (Optional)

If you want to test locally:
1. Create a `.env.local` file in the `member-resources-app` directory
2. Add: `DATABASE_URL=your_neon_connection_string_here`
3. Make sure `.env.local` is in your `.gitignore` (it should be already)
4. Restart your dev server

## Troubleshooting

- If you get connection errors, make sure the `DATABASE_URL` environment variable is set correctly
- Check that you've run the schema.sql to create the tables
- Make sure your Neon database is active (it may pause after inactivity on free tier)
- Verify the connection string format is correct

