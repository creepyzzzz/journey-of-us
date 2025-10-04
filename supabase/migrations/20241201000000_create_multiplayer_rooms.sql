-- Create multiplayer_rooms table
CREATE TABLE IF NOT EXISTS multiplayer_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  game_code VARCHAR(6) NOT NULL UNIQUE,
  host_player_id VARCHAR(255) NOT NULL,
  host_player_name VARCHAR(255) NOT NULL,
  joined_players JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed')),
  current_turn JSONB,
  wheel_history JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create index on game_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_multiplayer_rooms_game_code ON multiplayer_rooms(game_code);

-- Create index on game_id for game-related queries
CREATE INDEX IF NOT EXISTS idx_multiplayer_rooms_game_id ON multiplayer_rooms(game_id);

-- Create index on status for filtering active games
CREATE INDEX IF NOT EXISTS idx_multiplayer_rooms_status ON multiplayer_rooms(status);

-- Enable Row Level Security
ALTER TABLE multiplayer_rooms ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read multiplayer rooms (for joining)
CREATE POLICY "Allow public read access to multiplayer rooms" ON multiplayer_rooms
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert multiplayer rooms (for creating)
CREATE POLICY "Allow public insert access to multiplayer rooms" ON multiplayer_rooms
  FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to update multiplayer rooms (for game state changes)
CREATE POLICY "Allow public update access to multiplayer rooms" ON multiplayer_rooms
  FOR UPDATE USING (true);

-- Create policy to allow anyone to delete multiplayer rooms (for cleanup)
CREATE POLICY "Allow public delete access to multiplayer rooms" ON multiplayer_rooms
  FOR DELETE USING (true);

-- Add function to clean up old completed rooms (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_multiplayer_rooms()
RETURNS void AS $$
BEGIN
  DELETE FROM multiplayer_rooms 
  WHERE status = 'completed' 
  AND completed_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically clean up old rooms
-- This would typically be called by a cron job or scheduled task
-- For now, we'll just create the function
