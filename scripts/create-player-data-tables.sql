-- Create player_data table for comprehensive game state
CREATE TABLE IF NOT EXISTS player_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL, -- 'notes', 'settings', 'installed_tools', 'game_state'
  data_key TEXT NOT NULL,
  data_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, data_type, data_key)
);

-- Create game_sessions table to track player sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  total_playtime INTEGER DEFAULT 0, -- in seconds
  missions_completed_in_session INTEGER DEFAULT 0,
  credits_earned_in_session INTEGER DEFAULT 0
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create mission_progress table for detailed mission tracking
CREATE TABLE IF NOT EXISTS mission_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  mission_type TEXT NOT NULL,
  status TEXT DEFAULT 'available', -- 'available', 'in_progress', 'completed', 'failed'
  progress_percentage INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  best_time INTEGER, -- in seconds
  reward_earned INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

-- Create player_inventory table for tools and items
CREATE TABLE IF NOT EXISTS player_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'tool', 'upgrade', 'consumable'
  quantity INTEGER DEFAULT 1,
  purchase_price INTEGER,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, item_id)
);

-- Create player_statistics table for detailed stats
CREATE TABLE IF NOT EXISTS player_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stat_name TEXT NOT NULL,
  stat_value BIGINT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, stat_name)
);

-- Enable Row Level Security
ALTER TABLE player_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own player data" ON player_data FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own game sessions" ON game_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own achievements" ON achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own mission progress" ON mission_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own inventory" ON player_inventory FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own statistics" ON player_statistics FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS player_data_user_type_idx ON player_data(user_id, data_type);
CREATE INDEX IF NOT EXISTS game_sessions_user_id_idx ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS achievements_user_id_idx ON achievements(user_id);
CREATE INDEX IF NOT EXISTS mission_progress_user_id_idx ON mission_progress(user_id);
CREATE INDEX IF NOT EXISTS player_inventory_user_id_idx ON player_inventory(user_id);
CREATE INDEX IF NOT EXISTS player_statistics_user_id_idx ON player_statistics(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_player_data_updated_at BEFORE UPDATE ON player_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_statistics_updated_at BEFORE UPDATE ON player_statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
