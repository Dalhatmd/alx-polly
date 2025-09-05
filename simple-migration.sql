-- SIMPLE STEP-BY-STEP MIGRATION
-- Run these commands one at a time in your Supabase SQL editor

-- Step 1: Check what you currently have
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Step 2: Check current polls table structure (if it exists)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'polls' 
ORDER BY ordinal_position;

-- Step 3: Add missing columns one by one
-- (Only run the ALTER TABLE commands for columns that don't exist)

-- Add user_id column
ALTER TABLE polls ADD COLUMN user_id UUID;

-- Add title column (or rename question to title)
-- If you have a 'question' column, run this instead:
-- ALTER TABLE polls RENAME COLUMN question TO title;
-- If you don't have either, run this:
ALTER TABLE polls ADD COLUMN title TEXT;

-- Add description column
ALTER TABLE polls ADD COLUMN description TEXT;

-- Add options column (this is the most important one!)
ALTER TABLE polls ADD COLUMN options JSONB DEFAULT '[]'::jsonb;

-- Add timestamp columns
ALTER TABLE polls ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE polls ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add optional columns
ALTER TABLE polls ADD COLUMN end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE polls ADD COLUMN settings JSONB DEFAULT '{"allowMultipleVotes": false, "requireAuthentication": true}'::jsonb;

-- Step 4: Update existing data (if any)
UPDATE polls SET title = 'Untitled Poll' WHERE title IS NULL;
UPDATE polls SET options = '[]'::jsonb WHERE options IS NULL;

-- Step 5: Set constraints
ALTER TABLE polls ALTER COLUMN title SET NOT NULL;
ALTER TABLE polls ALTER COLUMN options SET NOT NULL;

-- Step 6: Check final structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'polls' 
ORDER BY ordinal_position;

