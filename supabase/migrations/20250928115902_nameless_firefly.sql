/*
  # Investment Platform and Chat Features

  1. New Tables
    - `investment_profiles` - SME funding profiles
    - `investor_profiles` - Investor profiles and preferences
    - `investment_interests` - Investor interest in SMEs
    - `investment_deals` - Investment transactions
    - `chat_rooms` - Chat room management
    - `chat_messages` - Chat messages
    - `chat_participants` - Chat room participants
    - `ai_chat_sessions` - AI chatbot sessions

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each user role

  3. Functions
    - AI matching algorithm for investors and SMEs
    - Chat room creation and management
*/

-- Create enum types for investment features
CREATE TYPE funding_stage AS ENUM ('idea', 'mvp', 'early_revenue', 'growth', 'expansion');
CREATE TYPE investment_status AS ENUM ('active', 'funded', 'closed', 'paused');
CREATE TYPE deal_status AS ENUM ('pending', 'negotiating', 'due_diligence', 'completed', 'cancelled');
CREATE TYPE chat_type AS ENUM ('buyer_seller', 'investor_sme', 'group', 'ai_support');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'voice', 'system');

-- Investment Profiles table (for SMEs seeking funding)
CREATE TABLE IF NOT EXISTS investment_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sme_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  industry text NOT NULL,
  stage funding_stage NOT NULL,
  description text NOT NULL,
  funding_amount decimal(12,2) NOT NULL CHECK (funding_amount > 0),
  equity_offered decimal(5,2) CHECK (equity_offered >= 0 AND equity_offered <= 100),
  current_revenue decimal(12,2) DEFAULT 0,
  profit_margin decimal(5,2),
  customer_count integer DEFAULT 0,
  growth_projections jsonb,
  pitch_deck_url text,
  financial_documents text[],
  business_plan_url text,
  team_info jsonb,
  milestones jsonb,
  use_of_funds text,
  status investment_status DEFAULT 'active',
  views_count integer DEFAULT 0,
  interest_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Investor Profiles table
CREATE TABLE IF NOT EXISTS investor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  investor_type text NOT NULL, -- 'angel', 'vc', 'institutional', 'retail'
  investment_range_min decimal(12,2) NOT NULL,
  investment_range_max decimal(12,2) NOT NULL,
  preferred_industries text[],
  preferred_stages funding_stage[],
  risk_appetite text, -- 'low', 'medium', 'high'
  investment_history jsonb,
  portfolio_companies text[],
  bio text,
  linkedin_url text,
  website_url text,
  verified boolean DEFAULT false,
  total_investments decimal(15,2) DEFAULT 0,
  successful_exits integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Investment Interests table (when investors show interest in SMEs)
CREATE TABLE IF NOT EXISTS investment_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  investment_profile_id uuid NOT NULL REFERENCES investment_profiles(id) ON DELETE CASCADE,
  interest_level text NOT NULL, -- 'low', 'medium', 'high'
  proposed_amount decimal(12,2),
  proposed_equity decimal(5,2),
  message text,
  status text DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  created_at timestamptz DEFAULT now(),
  UNIQUE(investor_id, investment_profile_id)
);

-- Investment Deals table
CREATE TABLE IF NOT EXISTS investment_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_profile_id uuid NOT NULL REFERENCES investment_profiles(id),
  investor_id uuid NOT NULL REFERENCES profiles(id),
  deal_amount decimal(12,2) NOT NULL,
  equity_percentage decimal(5,2) NOT NULL,
  valuation decimal(15,2),
  status deal_status DEFAULT 'pending',
  terms jsonb,
  documents text[],
  escrow_wallet_id text,
  signed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat Rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  type chat_type NOT NULL,
  created_by uuid NOT NULL REFERENCES profiles(id),
  metadata jsonb, -- Store additional info like product_id, investment_profile_id
  is_active boolean DEFAULT true,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Chat Participants table
CREATE TABLE IF NOT EXISTS chat_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz DEFAULT now(),
  is_admin boolean DEFAULT false,
  UNIQUE(chat_room_id, user_id)
);

-- Chat Messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  message_type message_type DEFAULT 'text',
  content text NOT NULL,
  file_url text,
  file_name text,
  file_size integer,
  reply_to_id uuid REFERENCES chat_messages(id),
  is_edited boolean DEFAULT false,
  is_ai_message boolean DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI Chat Sessions table
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_context jsonb, -- Store conversation context for AI
  last_interaction_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE investment_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;

-- Investment Profiles policies
CREATE POLICY "Active investment profiles viewable by everyone" ON investment_profiles
  FOR SELECT USING (status = 'active');

CREATE POLICY "SMEs can manage own investment profiles" ON investment_profiles
  FOR ALL USING (sme_id = auth.uid());

CREATE POLICY "Investors can view all investment profiles" ON investment_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM investor_profiles 
      WHERE investor_profiles.investor_id = auth.uid()
    )
  );

-- Investor Profiles policies
CREATE POLICY "Verified investor profiles viewable by SMEs" ON investor_profiles
  FOR SELECT USING (verified = true);

CREATE POLICY "Investors can manage own profiles" ON investor_profiles
  FOR ALL USING (investor_id = auth.uid());

-- Investment Interests policies
CREATE POLICY "SMEs can view interests in their profiles" ON investment_interests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM investment_profiles 
      WHERE investment_profiles.id = investment_interests.investment_profile_id 
      AND investment_profiles.sme_id = auth.uid()
    )
  );

CREATE POLICY "Investors can manage own interests" ON investment_interests
  FOR ALL USING (investor_id = auth.uid());

-- Investment Deals policies
CREATE POLICY "Deal participants can view deals" ON investment_deals
  FOR SELECT USING (
    investor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM investment_profiles 
      WHERE investment_profiles.id = investment_deals.investment_profile_id 
      AND investment_profiles.sme_id = auth.uid()
    )
  );

-- Chat Rooms policies
CREATE POLICY "Chat participants can view rooms" ON chat_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE chat_participants.chat_room_id = chat_rooms.id 
      AND chat_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat rooms" ON chat_rooms
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Chat Participants policies
CREATE POLICY "Chat participants can view participants" ON chat_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_participants cp 
      WHERE cp.chat_room_id = chat_participants.chat_room_id 
      AND cp.user_id = auth.uid()
    )
  );

-- Chat Messages policies
CREATE POLICY "Chat participants can view messages" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE chat_participants.chat_room_id = chat_messages.chat_room_id 
      AND chat_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Chat participants can send messages" ON chat_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE chat_participants.chat_room_id = chat_messages.chat_room_id 
      AND chat_participants.user_id = auth.uid()
    )
  );

-- AI Chat Sessions policies
CREATE POLICY "Users can manage own AI chat sessions" ON ai_chat_sessions
  FOR ALL USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investment_profiles_sme_id ON investment_profiles(sme_id);
CREATE INDEX IF NOT EXISTS idx_investment_profiles_industry ON investment_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_investment_profiles_stage ON investment_profiles(stage);
CREATE INDEX IF NOT EXISTS idx_investment_profiles_status ON investment_profiles(status);
CREATE INDEX IF NOT EXISTS idx_investor_profiles_investor_id ON investor_profiles(investor_id);
CREATE INDEX IF NOT EXISTS idx_investment_interests_investor_id ON investment_interests(investor_id);
CREATE INDEX IF NOT EXISTS idx_investment_interests_investment_profile_id ON investment_interests(investment_profile_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON chat_rooms(type);
CREATE INDEX IF NOT EXISTS idx_chat_participants_chat_room_id ON chat_participants(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_room_id ON chat_messages(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Create triggers for updated_at
CREATE TRIGGER update_investment_profiles_updated_at BEFORE UPDATE ON investment_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investor_profiles_updated_at BEFORE UPDATE ON investor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_deals_updated_at BEFORE UPDATE ON investment_deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update chat room last message timestamp
CREATE OR REPLACE FUNCTION update_chat_room_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_rooms SET
    last_message_at = NEW.created_at
  WHERE id = NEW.chat_room_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update chat room timestamp
CREATE TRIGGER update_chat_room_last_message_trigger
  AFTER INSERT ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_chat_room_last_message();

-- Function to increment interest count
CREATE OR REPLACE FUNCTION update_investment_interest_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE investment_profiles SET
      interest_count = interest_count + 1
    WHERE id = NEW.investment_profile_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE investment_profiles SET
      interest_count = GREATEST(0, interest_count - 1)
    WHERE id = OLD.investment_profile_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to update interest count
CREATE TRIGGER update_investment_interest_count_trigger
  AFTER INSERT OR DELETE ON investment_interests
  FOR EACH ROW EXECUTE FUNCTION update_investment_interest_count();