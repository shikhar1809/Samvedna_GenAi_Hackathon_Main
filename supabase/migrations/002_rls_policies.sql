-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vents ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cbt_reframes ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Journals Policies
CREATE POLICY "Users can view their own journals"
    ON journals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journals"
    ON journals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journals"
    ON journals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journals"
    ON journals FOR DELETE
    USING (auth.uid() = user_id);

-- Diagnoses Policies
CREATE POLICY "Users can view their own diagnoses"
    ON diagnoses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnoses"
    ON diagnoses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Vents Policies (Public read, authenticated write)
CREATE POLICY "Anyone can view vents"
    ON vents FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create vents"
    ON vents FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Peer Connections Policies
CREATE POLICY "Users can view their own connections"
    ON peer_connections FOR SELECT
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create connections involving themselves"
    ON peer_connections FOR INSERT
    WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their own connections"
    ON peer_connections FOR UPDATE
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages Policies
CREATE POLICY "Users can view messages in their connections"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM peer_connections
            WHERE peer_connections.id = messages.connection_id
            AND (peer_connections.user1_id = auth.uid() OR peer_connections.user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their connections"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM peer_connections
            WHERE peer_connections.id = connection_id
            AND (peer_connections.user1_id = auth.uid() OR peer_connections.user2_id = auth.uid())
        )
    );

-- Groups Policies
CREATE POLICY "Anyone can view groups"
    ON groups FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create groups"
    ON groups FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Group Members Policies
CREATE POLICY "Anyone can view group members"
    ON group_members FOR SELECT
    USING (true);

CREATE POLICY "Users can join groups"
    ON group_members FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
    ON group_members FOR DELETE
    USING (auth.uid() = user_id);

-- Group Posts Policies
CREATE POLICY "Group members can view posts"
    ON group_posts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = group_posts.group_id
            AND group_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Group members can create posts"
    ON group_posts FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = group_posts.group_id
            AND group_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own posts"
    ON group_posts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
    ON group_posts FOR DELETE
    USING (auth.uid() = user_id);

-- Therapist Reports Policies
CREATE POLICY "Users can view their own reports"
    ON therapist_reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports"
    ON therapist_reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Gratitude Entries Policies
CREATE POLICY "Users can view their own gratitude entries"
    ON gratitude_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own gratitude entries"
    ON gratitude_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gratitude entries"
    ON gratitude_entries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gratitude entries"
    ON gratitude_entries FOR DELETE
    USING (auth.uid() = user_id);

-- CBT Reframes Policies
CREATE POLICY "Users can view their own CBT reframes"
    ON cbt_reframes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CBT reframes"
    ON cbt_reframes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CBT reframes"
    ON cbt_reframes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CBT reframes"
    ON cbt_reframes FOR DELETE
    USING (auth.uid() = user_id);

