-- Support Bot Conversations Table
CREATE TABLE support_bot_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    anonymous_id TEXT, -- For unauthenticated users
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT user_or_anonymous CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);

-- Support Bot Habits Table
CREATE TABLE support_bot_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    anonymous_id TEXT, -- For unauthenticated users
    habit_type TEXT NOT NULL, -- e.g., 'emotional_pattern', 'topic_interest', 'response_style'
    description TEXT NOT NULL,
    frequency INTEGER DEFAULT 1,
    last_observed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT user_or_anonymous CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);

-- Create indexes for better query performance
CREATE INDEX idx_support_bot_conversations_user_id ON support_bot_conversations(user_id);
CREATE INDEX idx_support_bot_conversations_anonymous_id ON support_bot_conversations(anonymous_id);
CREATE INDEX idx_support_bot_conversations_created_at ON support_bot_conversations(created_at DESC);
CREATE INDEX idx_support_bot_habits_user_id ON support_bot_habits(user_id);
CREATE INDEX idx_support_bot_habits_anonymous_id ON support_bot_habits(anonymous_id);
CREATE INDEX idx_support_bot_habits_habit_type ON support_bot_habits(habit_type);
CREATE INDEX idx_support_bot_habits_last_observed ON support_bot_habits(last_observed DESC);

-- Enable Row Level Security
ALTER TABLE support_bot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_bot_habits ENABLE ROW LEVEL SECURITY;

-- Support Bot Conversations Policies
-- Authenticated users can view their own conversations
CREATE POLICY "Users can view their own conversations"
    ON support_bot_conversations FOR SELECT
    USING (auth.uid() = user_id);

-- Authenticated users can create their own conversations
CREATE POLICY "Users can create their own conversations"
    ON support_bot_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Anonymous users can view conversations with their anonymous_id
-- Note: Client-side validation is required. Edge function validates server-side.
CREATE POLICY "Anonymous users can view their conversations"
    ON support_bot_conversations FOR SELECT
    USING (
        anonymous_id IS NOT NULL AND
        user_id IS NULL
    );

-- Anonymous users can create conversations
-- Note: Edge function validates anonymous_id server-side
CREATE POLICY "Anonymous users can create conversations"
    ON support_bot_conversations FOR INSERT
    WITH CHECK (
        anonymous_id IS NOT NULL AND
        user_id IS NULL
    );

-- Support Bot Habits Policies
-- Authenticated users can view their own habits
CREATE POLICY "Users can view their own habits"
    ON support_bot_habits FOR SELECT
    USING (auth.uid() = user_id);

-- Authenticated users can create their own habits
CREATE POLICY "Users can create their own habits"
    ON support_bot_habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own habits
CREATE POLICY "Users can update their own habits"
    ON support_bot_habits FOR UPDATE
    USING (auth.uid() = user_id);

-- Anonymous users can view habits with their anonymous_id
-- Note: Client-side filtering by anonymous_id is required. Edge function validates server-side.
CREATE POLICY "Anonymous users can view their habits"
    ON support_bot_habits FOR SELECT
    USING (
        anonymous_id IS NOT NULL AND
        user_id IS NULL
    );

-- Anonymous users can create habits
-- Note: Edge function validates anonymous_id server-side
CREATE POLICY "Anonymous users can create habits"
    ON support_bot_habits FOR INSERT
    WITH CHECK (
        anonymous_id IS NOT NULL AND
        user_id IS NULL
    );

-- Anonymous users can update habits
-- Note: Edge function validates anonymous_id server-side
CREATE POLICY "Anonymous users can update habits"
    ON support_bot_habits FOR UPDATE
    USING (
        anonymous_id IS NOT NULL AND
        user_id IS NULL
    );

