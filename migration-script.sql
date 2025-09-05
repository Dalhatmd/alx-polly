-- Safe Migration Script for ALX Polly Database
-- Run this step by step, checking results after each section

-- STEP 1: Check if polls table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'polls') THEN
        -- Create the polls table from scratch if it doesn't exist
        CREATE TABLE polls (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            options JSONB NOT NULL DEFAULT '[]'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            end_date TIMESTAMP WITH TIME ZONE,
            settings JSONB DEFAULT '{"allowMultipleVotes": false, "requireAuthentication": true}'::jsonb
        );
        
        RAISE NOTICE 'Created new polls table';
    ELSE
        RAISE NOTICE 'Polls table already exists, proceeding with migration';
    END IF;
END $$;

-- STEP 2: Add missing columns if they don't exist
DO $$
BEGIN
    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'polls' AND column_name = 'user_id') THEN
        ALTER TABLE polls ADD COLUMN user_id UUID;
        RAISE NOTICE 'Added user_id column';
        
        -- You'll need to populate this column with actual user IDs
        -- For now, we'll leave it NULL and you can update it later
        -- UPDATE polls SET user_id = 'your-user-id-here' WHERE user_id IS NULL;
    END IF;

    -- Add title column if it doesn't exist (might be called 'question')
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'polls' AND column_name = 'title') THEN
        -- Check if there's a 'question' column to rename
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'polls' AND column_name = 'question') THEN
            ALTER TABLE polls RENAME COLUMN question TO title;
            RAISE NOTICE 'Renamed question column to title';
        ELSE
            ALTER TABLE polls ADD COLUMN title TEXT;
            RAISE NOTICE 'Added title column';
        END IF;
    END IF;

    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'polls' AND column_name = 'description') THEN
        ALTER TABLE polls ADD COLUMN description TEXT;
        RAISE NOTICE 'Added description column';
    END IF;

    -- Add options column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'polls' AND column_name = 'options') THEN
        ALTER TABLE polls ADD COLUMN options JSONB NOT NULL DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Added options column';
    END IF;

    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'polls' AND column_name = 'created_at') THEN
        ALTER TABLE polls ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added created_at column';
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'polls' AND column_name = 'updated_at') THEN
        ALTER TABLE polls ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column';
    END IF;

    -- Add end_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'polls' AND column_name = 'end_date') THEN
        ALTER TABLE polls ADD COLUMN end_date TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added end_date column';
    END IF;

    -- Add settings column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'polls' AND column_name = 'settings') THEN
        ALTER TABLE polls ADD COLUMN settings JSONB DEFAULT '{"allowMultipleVotes": false, "requireAuthentication": true}'::jsonb;
        RAISE NOTICE 'Added settings column';
    END IF;
END $$;

-- STEP 3: Update column constraints and defaults
DO $$
BEGIN
    -- Make title NOT NULL if it has values
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'polls' AND column_name = 'title') THEN
        -- First, update any NULL titles
        UPDATE polls SET title = 'Untitled Poll' WHERE title IS NULL OR title = '';
        
        -- Then add NOT NULL constraint
        ALTER TABLE polls ALTER COLUMN title SET NOT NULL;
        RAISE NOTICE 'Made title column NOT NULL';
    END IF;

    -- Make options NOT NULL if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'polls' AND column_name = 'options') THEN
        -- First, update any NULL options
        UPDATE polls SET options = '[]'::jsonb WHERE options IS NULL;
        
        -- Then add NOT NULL constraint if not already set
        BEGIN
            ALTER TABLE polls ALTER COLUMN options SET NOT NULL;
            RAISE NOTICE 'Made options column NOT NULL';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Options column already NOT NULL or constraint failed';
        END;
    END IF;
END $$;

-- STEP 4: Add foreign key constraint for user_id (only if auth.users table exists)
DO $$
BEGIN
    -- Check if auth.users table exists before adding foreign key
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        -- Add foreign key constraint if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'polls_user_id_fkey' 
            AND table_name = 'polls'
        ) THEN
            -- Only add constraint if user_id column exists and has valid references
            BEGIN
                ALTER TABLE polls ADD CONSTRAINT polls_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
                RAISE NOTICE 'Added foreign key constraint for user_id';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not add foreign key constraint - you may need to populate user_id with valid values first';
            END;
        END IF;
    ELSE
        RAISE NOTICE 'auth.users table not found - skipping foreign key constraint';
    END IF;
END $$;

-- STEP 5: Create votes table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'votes') THEN
        CREATE TABLE votes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
            user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            option_index INTEGER NOT NULL,
            option_id TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created votes table';
    ELSE
        RAISE NOTICE 'Votes table already exists';
    END IF;
END $$;

-- STEP 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS polls_user_id_idx ON polls(user_id);
CREATE INDEX IF NOT EXISTS polls_created_at_idx ON polls(created_at DESC);
CREATE INDEX IF NOT EXISTS votes_poll_id_idx ON votes(poll_id);
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON votes(user_id);

-- STEP 7: Enable Row Level Security
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- STEP 8: Show final table structure
SELECT 'Final polls table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'polls' 
ORDER BY ordinal_position;

