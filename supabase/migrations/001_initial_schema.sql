-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    big_five_scores JSONB NOT NULL DEFAULT '{}',
    personality_type TEXT,
    mental_health_history TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journals Table
CREATE TABLE journals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
    mood_tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diagnoses Table
CREATE TABLE diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    journal_id UUID REFERENCES journals(id) ON DELETE SET NULL,
    analysis JSONB NOT NULL DEFAULT '{}',
    dsm5_codes TEXT[] DEFAULT '{}',
    severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
    suggestions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vents Table (Anonymous)
CREATE TABLE vents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anonymous_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_anonymized BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Peer Connections Table
CREATE TABLE peer_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    match_score DECIMAL(3,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 1),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'ended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT different_users CHECK (user1_id != user2_id),
    CONSTRAINT unique_connection UNIQUE (user1_id, user2_id)
);

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connection_id UUID REFERENCES peer_connections(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups Table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Anxiety', 'Depression', 'PTSD', 'Bipolar', 'OCD', 'Eating Disorders', 'Addiction', 'General', 'Other')),
    member_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group Members Table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_group_member UNIQUE (group_id, user_id)
);

-- Group Posts Table
CREATE TABLE group_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Therapist Reports Table
CREATE TABLE therapist_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    report_data JSONB NOT NULL DEFAULT '{}',
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gratitude Entries Table
CREATE TABLE gratitude_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CBT Reframes Table
CREATE TABLE cbt_reframes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    original_thought TEXT NOT NULL,
    distortions TEXT[] DEFAULT '{}',
    reframe TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_journals_user_id ON journals(user_id);
CREATE INDEX idx_journals_created_at ON journals(created_at DESC);
CREATE INDEX idx_diagnoses_user_id ON diagnoses(user_id);
CREATE INDEX idx_diagnoses_journal_id ON diagnoses(journal_id);
CREATE INDEX idx_messages_connection_id ON messages(connection_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_posts_group_id ON group_posts(group_id);
CREATE INDEX idx_group_posts_created_at ON group_posts(created_at DESC);
CREATE INDEX idx_gratitude_entries_user_id ON gratitude_entries(user_id);
CREATE INDEX idx_cbt_reframes_user_id ON cbt_reframes(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment group member count
CREATE OR REPLACE FUNCTION increment_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement group member count
CREATE OR REPLACE FUNCTION decrement_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for group member count
CREATE TRIGGER increment_group_members
    AFTER INSERT ON group_members
    FOR EACH ROW
    EXECUTE FUNCTION increment_group_member_count();

CREATE TRIGGER decrement_group_members
    AFTER DELETE ON group_members
    FOR EACH ROW
    EXECUTE FUNCTION decrement_group_member_count();

