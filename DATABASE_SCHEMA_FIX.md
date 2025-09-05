# Fix: Database Schema Mismatch Error

## Problem
You're getting the error: **"Could not find the 'options' column of 'polls' in the schema cache"**

This happens because there's a mismatch between your TypeScript types and your actual database schema.

## Root Cause
- Your TypeScript interface expects an 'options' column in the polls table
- Your database schema likely has a different column name or structure

## Solutions

### Step 1: Update Your Database Schema

Go to your **Supabase Dashboard** → **SQL Editor** and run the SQL script from `database-schema.sql`:

```sql
-- Create or update the polls table with correct structure
CREATE TABLE IF NOT EXISTS polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    options JSONB NOT NULL, -- This is the crucial 'options' column
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{"allowMultipleVotes": false, "requireAuthentication": true}'::jsonb
);
```

### Step 2: If You Have Existing Data

If you already have a polls table with different column names, you might need to migrate:

```sql
-- If your table has 'question' instead of 'title'
ALTER TABLE polls RENAME COLUMN question TO title;

-- If you don't have an 'options' column, add it
ALTER TABLE polls ADD COLUMN IF NOT EXISTS options JSONB NOT NULL DEFAULT '[]'::jsonb;

-- If you don't have a 'description' column, add it
ALTER TABLE polls ADD COLUMN IF NOT EXISTS description TEXT;
```

### Step 3: Code Changes Made

I've already updated your poll actions (`app/lib/actions/poll-actions.ts`) to:

1. ✅ Use `title` instead of `question` 
2. ✅ Support both `title` and `description` fields
3. ✅ Handle the `options` array properly
4. ✅ Make functions backward compatible (they still accept `question` if needed)

### Step 4: Database Columns Expected by Your Code

Your application now expects these columns in the `polls` table:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Yes | Primary key |
| `user_id` | UUID | Yes | References auth.users(id) |
| `title` | TEXT | Yes | Poll title (was 'question') |
| `description` | TEXT | No | Optional poll description |
| `options` | JSONB | Yes | Array of poll options |
| `created_at` | TIMESTAMP | Auto | Creation timestamp |
| `updated_at` | TIMESTAMP | Auto | Last update timestamp |
| `end_date` | TIMESTAMP | No | Optional poll end date |
| `settings` | JSONB | Auto | Poll settings (voting rules) |

### Step 5: Test the Fix

After updating your database schema:

1. Try creating a new poll
2. Check if the error is resolved
3. Verify that options are stored correctly as JSONB

### Troubleshooting

If you still get errors:

1. **Check your database URL**: Ensure your `.env.local` has the correct Supabase credentials
2. **Verify column names**: Go to Supabase Dashboard → Table Editor → polls table
3. **Check data types**: Ensure `options` column is JSONB, not TEXT
4. **Clear cache**: Restart your development server

### Alternative Quick Fix

If you can't modify the database immediately, you could temporarily modify your TypeScript types to match your current database schema, but **updating the database is the recommended approach**.

## Files Modified

- ✅ `app/lib/actions/poll-actions.ts` - Updated to use correct column names
- ✅ `database-schema.sql` - Complete schema for your database
- ✅ `DATABASE_SCHEMA_FIX.md` - This troubleshooting guide

## Next Steps

1. Run the SQL schema in your Supabase dashboard
2. Test creating a new poll
3. If successful, you can remove the temporary files (`database-schema.sql`, `DATABASE_SCHEMA_FIX.md`)

The error should be resolved once your database schema matches what your application code expects!

