-- ALX Polly Database Schema
-- Run this in your Supabase SQL editor to create the proper schema

-- Create polls table with the correct structure
CREATE TABLE IF NOT EXISTS polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- Changed from 'question' to match TypeScript interface
    description TEXT,
    options JSONB NOT NULL, -- Store options as JSONB array
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{"allowMultipleVotes": false, "requireAuthentication": true}'::jsonb
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    option_index INTEGER NOT NULL,
    option_id TEXT, -- For future use with separate poll options table
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS polls_user_id_idx ON polls(user_id);
CREATE INDEX IF NOT EXISTS polls_created_at_idx ON polls(created_at DESC);
CREATE INDEX IF NOT EXISTS votes_poll_id_idx ON votes(poll_id);
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON votes(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for polls table
CREATE POLICY "Users can view all polls" ON polls
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own polls" ON polls
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own polls" ON polls
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own polls" ON polls
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for votes table
CREATE POLICY "Users can view votes for polls they can see" ON votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id
        )
    );

CREATE POLICY "Authenticated users can vote" ON votes
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id
        )
    );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_polls_updated_at 
    BEFORE UPDATE ON polls 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- If you have existing data, you might need to migrate it
-- Uncomment and modify these if you have existing polls with 'question' column:

-- ALTER TABLE polls RENAME COLUMN question TO title;
-- UPDATE polls SET options = COALESCE(options, '[]'::jsonb) WHERE options IS NULL;

