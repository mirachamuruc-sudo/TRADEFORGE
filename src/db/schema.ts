/**
 * TRADEFORGE Relational Database Schema & Models
 * Scalable schema definition for PostgreSQL / Cloud SQL / Drizzle ORM
 * 
 * Tables:
 * - users: core credentials & account state
 * - profiles: public persona, bios, badges, Roblox & Discord links
 * - discord_accounts: Discord OAuth connection records
 * - roblox_accounts: Verified Roblox developer/player identities
 * - projects: developer plugins, models, frameworks, tools
 * - games: Roblox game titles, places, universe IDs
 * - items: virtual goods, custom UI packs, scripts, assets
 * - marketplace_listings: peer-to-peer fixed price offers
 * - auctions: timed competitive bidding listings
 * - bids: individual bids on auctions
 * - trades: peer item-for-item or asset barter offers
 * - notifications: real-time user notification feed
 * - community_posts: forum and showcase discussions
 * - comments: threaded post interactions
 * - achievements: system milestone badges
 * - user_achievements: awarded user badges
 */

export const SCHEMA_DEFINITIONS = `
-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(32) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  password_salt VARCHAR(64) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'developer', 'creator', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(64) NOT NULL,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  banner_url TEXT DEFAULT '',
  roblox_username VARCHAR(64),
  roblox_verified BOOLEAN DEFAULT FALSE,
  discord_username VARCHAR(64),
  discord_verified BOOLEAN DEFAULT FALSE,
  github_url VARCHAR(255),
  twitter_url VARCHAR(255),
  reputation_score INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- DISCORD ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS discord_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  discord_id VARCHAR(64) UNIQUE NOT NULL,
  username VARCHAR(64) NOT NULL,
  avatar VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_discord_user_id ON discord_accounts(user_id);

-- ROBLOX ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS roblox_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  roblox_id VARCHAR(64) UNIQUE NOT NULL,
  username VARCHAR(64) NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_roblox_user_id ON roblox_accounts(user_id);

-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(32) NOT NULL,
  roblox_asset_url TEXT,
  github_url TEXT,
  tags TEXT[] DEFAULT '{}',
  likes_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- GAMES TABLE
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  genre VARCHAR(64) NOT NULL,
  place_id VARCHAR(64),
  universe_id VARCHAR(64),
  visits_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_games_creator_id ON games(creator_id);

-- ITEMS TABLE
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(128) NOT NULL,
  category VARCHAR(64) NOT NULL,
  rarity VARCHAR(32) NOT NULL,
  description TEXT,
  asset_type VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MARKETPLACE LISTINGS TABLE
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(64) NOT NULL,
  rarity VARCHAR(32) NOT NULL DEFAULT 'Common',
  price_robux INT NOT NULL DEFAULT 0,
  price_tf INT NOT NULL DEFAULT 0,
  item_type VARCHAR(64) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_category ON marketplace_listings(category);

-- AUCTIONS TABLE
CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_title VARCHAR(128) NOT NULL,
  item_category VARCHAR(64) NOT NULL,
  item_rarity VARCHAR(32) NOT NULL DEFAULT 'Common',
  description TEXT NOT NULL,
  starting_bid INT NOT NULL,
  current_bid INT NOT NULL,
  min_bid_increment INT NOT NULL DEFAULT 10,
  highest_bidder_id UUID REFERENCES users(id) ON DELETE SET NULL,
  bids_count INT DEFAULT 0,
  ends_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_ends_at ON auctions(ends_at);

-- BIDS TABLE
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);

-- TRADES TABLE
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offered_items JSONB NOT NULL DEFAULT '[]',
  requested_items JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trades_sender_id ON trades(sender_id);
CREATE INDEX IF NOT EXISTS idx_trades_receiver_id ON trades(receiver_id);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(32) NOT NULL CHECK (type IN ('trade', 'auction', 'community', 'system', 'achievement')),
  title VARCHAR(128) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, read);

-- COMMUNITY POSTS TABLE
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  section VARCHAR(32) NOT NULL CHECK (section IN ('Posts', 'Discussions', 'Showcases', 'Questions', 'Announcements')),
  title VARCHAR(180) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_community_section ON community_posts(section);
CREATE INDEX IF NOT EXISTS idx_community_created_at ON community_posts(created_at DESC);

-- COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(64) UNIQUE NOT NULL,
  title VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(64) NOT NULL,
  badge_rarity VARCHAR(32) NOT NULL,
  points INT DEFAULT 10
);

-- USER ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
`;
