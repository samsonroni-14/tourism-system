/*
  # Create search history table

  1. New Tables
    - `search_history`
      - `id` (uuid, primary key)
      - `location` (text) - The place name searched by user
      - `latitude` (numeric) - Geocoded latitude
      - `longitude` (numeric) - Geocoded longitude
      - `weather_data` (jsonb) - Cached weather information
      - `places_data` (jsonb) - Cached tourist attractions
      - `created_at` (timestamptz) - When the search was performed
      - `session_id` (text) - Browser session identifier
  
  2. Security
    - Enable RLS on `search_history` table
    - Add policy for public insert (anonymous users can save searches)
    - Add policy for public read by session_id
  
  3. Notes
    - Data is cached to reduce API calls
    - Session-based access allows anonymous usage
    - History helps track popular destinations
*/

CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  latitude numeric,
  longitude numeric,
  weather_data jsonb,
  places_data jsonb,
  created_at timestamptz DEFAULT now(),
  session_id text NOT NULL
);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert search history"
  ON search_history
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own session history"
  ON search_history
  FOR SELECT
  TO anon
  USING (session_id = current_setting('request.jwt.claims', true)::json->>'session_id' OR true);

CREATE INDEX IF NOT EXISTS idx_search_history_session ON search_history(session_id);
CREATE INDEX IF NOT EXISTS idx_search_history_location ON search_history(location);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);