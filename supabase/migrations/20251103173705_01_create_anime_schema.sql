/*
  # Create Anime Streaming Database Schema

  1. New Tables
    - `users` (uses Supabase auth, this table stores additional user data)
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `username` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    
    - `anime` (main anime catalog)
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `banner_url` (text)
      - `genres` (text array)
      - `rating` (numeric)
      - `year` (integer)
      - `status` (text: ongoing, completed, upcoming)
      - `total_episodes` (integer)
      - `created_at` (timestamp)
    
    - `episodes` (anime episodes)
      - `id` (uuid, primary key)
      - `anime_id` (uuid, foreign key)
      - `episode_number` (integer)
      - `title` (text)
      - `description` (text)
      - `video_url` (text)
      - `thumbnail_url` (text)
      - `duration_minutes` (integer)
      - `aired_at` (timestamp)
      - `created_at` (timestamp)
    
    - `watch_history` (track user viewing progress)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `anime_id` (uuid, foreign key)
      - `episode_id` (uuid, foreign key)
      - `watched_at` (timestamp)
      - `progress_minutes` (integer)
      - `created_at` (timestamp)
    
    - `watchlist` (user's watchlist)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `anime_id` (uuid, foreign key)
      - `status` (text: watching, plan-to-watch, completed, dropped)
      - `created_at` (timestamp)
    
    - `comments` (anime comments/reviews)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `anime_id` (uuid, foreign key)
      - `episode_id` (uuid, foreign key, nullable)
      - `content` (text)
      - `rating` (integer 1-5)
      - `likes_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `likes` (track comment likes)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `comment_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read anime data
    - Add policies for users to manage their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS anime (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  banner_url text,
  genres text[] DEFAULT '{}',
  rating numeric DEFAULT 0,
  year integer,
  status text DEFAULT 'ongoing',
  total_episodes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id uuid NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  episode_number integer NOT NULL,
  title text NOT NULL,
  description text,
  video_url text,
  thumbnail_url text,
  duration_minutes integer,
  aired_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(anime_id, episode_number)
);

CREATE TABLE IF NOT EXISTS watch_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  anime_id uuid NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  episode_id uuid REFERENCES episodes(id) ON DELETE CASCADE,
  watched_at timestamptz DEFAULT now(),
  progress_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, episode_id)
);

CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  anime_id uuid NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  status text DEFAULT 'plan-to-watch',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, anime_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  anime_id uuid NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
  episode_id uuid REFERENCES episodes(id) ON DELETE CASCADE,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can read anime"
  ON anime FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read episodes"
  ON episodes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own watch history"
  ON watch_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watch history"
  ON watch_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch history"
  ON watch_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watch history"
  ON watch_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own watchlist"
  ON watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist"
  ON watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist"
  ON watchlist FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist"
  ON watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage likes"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_episodes_anime_id ON episodes(anime_id);
CREATE INDEX idx_watch_history_user_id ON watch_history(user_id);
CREATE INDEX idx_watch_history_anime_id ON watch_history(anime_id);
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_comments_anime_id ON comments(anime_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_likes_comment_id ON likes(comment_id);
