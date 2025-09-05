-- Check current table structure
-- Run this first to see what columns exist

-- Check if polls table exists and show its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'polls' 
ORDER BY ordinal_position;

-- If polls table doesn't exist, this will show empty results
-- Check what tables exist in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

